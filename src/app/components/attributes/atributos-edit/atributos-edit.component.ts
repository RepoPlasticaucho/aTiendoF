import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faTimes, faList, faSave } from '@fortawesome/free-solid-svg-icons';
import { AtributosEntity } from 'src/app/models/atributos';
import { AtributosService } from 'src/app/services/atributos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-atributos-edit',
  templateUrl: './atributos-edit.component.html',
  styleUrls: ['./atributos-edit.component.css']
})
export class AtributosEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faList = faList;
  faSave = faSave;
  //Creación de la variable para formulario
  attributeForm = new FormGroup({
    atributo: new FormControl('', Validators.required),
    etiquetas: new FormControl('',),
  });
  //Declaracion de variables
  private codigo: string = "";

  constructor(private readonly httpService: AtributosService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpService.obteneratributo$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id;
        this.attributeForm.get("atributo")?.setValue(res.atributo);
        this.attributeForm.get("etiquetas")?.setValue(res.etiquetas);
      }
    });
  }

  onSubmit(): void {
    if (!this.attributeForm.valid) {
      this.attributeForm.markAllAsTouched();
    } else {
      const attributeEntity: AtributosEntity = {
        id: this.codigo,
        atributo: this.attributeForm.value!.atributo ?? "",
        etiquetas: this.attributeForm.value!.etiquetas ?? ""
      }
      this.httpService.actualizarAtributo(attributeEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado Correctamente.',
            text: `Se ha actualizado la información`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['atributos'] } }]);
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

  visualizarAtributos(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['atributos'] } }]);
  }

}
