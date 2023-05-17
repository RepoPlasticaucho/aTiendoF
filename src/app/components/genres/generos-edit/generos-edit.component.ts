import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { GenerosEntity } from 'src/app/models/generos';
import { GenerosService } from 'src/app/services/generos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generos-edit',
  templateUrl: './generos-edit.component.html',
  styleUrls: ['./generos-edit.component.css']
})
export class GenerosEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  genreForm = new FormGroup({
    genero: new FormControl('', Validators.required),
    etiquetas: new FormControl('',)
  });
  //Declaracion de variables
  private codigo: string = "";
  
  constructor(private readonly httpService: GenerosService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpService.obtenergenero$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id;
        this.genreForm.get("genero")?.setValue(res.genero);
        this.genreForm.get("etiquetas")?.setValue(res.etiquetas);
      }
    });
  }

  onSubmit(): void {
    if (!this.genreForm.valid) {
      this.genreForm.markAllAsTouched();
    } else {
      const genreEntity: GenerosEntity = {
        id: this.codigo,
        genero: this.genreForm.value!.genero ?? "",
        etiquetas: this.genreForm.value!.etiquetas ?? ""
      }
      this.httpService.actualizarGenero(genreEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado Correctamente.',
            text: `Se ha actualizado la información`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['generos'] } }]);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        }
      })
    }
  }

  visualizarGeneros(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['generos'] } }]);
  }

}
