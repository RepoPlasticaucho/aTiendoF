import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faShoppingCart, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { GenerosEntity } from 'src/app/models/generos';
import { GenerosService } from 'src/app/services/generos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generos-create',
  templateUrl: './generos-create.component.html',
  styleUrls: ['./generos-create.component.css']
})
export class GenerosCreateComponent implements OnInit {
  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  genreForm = new FormGroup({
    genero: new FormControl('', Validators.required),
    etiquetas: new FormControl('',)
  });
  constructor(private readonly httpService: GenerosService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.genreForm.valid) {
      this.genreForm.markAllAsTouched();
    } else {
      const genreEntity: GenerosEntity = {
        id: "",
        genero: this.genreForm.value!.genero ?? "",
        etiquetas: this.genreForm.value!.etiquetas ?? ""
      }
      this.httpService.agregarGenero(genreEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el género ${this.genreForm.value.genero}`,
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
