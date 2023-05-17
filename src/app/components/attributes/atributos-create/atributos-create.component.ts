import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AtributosEntity } from 'src/app/models/atributos';
import { AtributosService } from 'src/app/services/atributos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-atributos-create',
  templateUrl: './atributos-create.component.html',
  styleUrls: ['./atributos-create.component.css']
})
export class AtributosCreateComponent implements OnInit {
  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faList = faList;
  faSave = faSave;
  //Creación de la variable para formulario
  attributeForm = new FormGroup({
    atributo: new FormControl('', Validators.required),
    etiquetas: new FormControl('',),
  });
  constructor(private readonly httpService: AtributosService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.attributeForm.valid) {
      this.attributeForm.markAllAsTouched();
    } else {
      const attributeEntity: AtributosEntity = {
        id: "",
        atributo: this.attributeForm.value!.atributo ?? "",
        etiquetas: this.attributeForm.value!.etiquetas ?? ""
      }
      this.httpService.agregarAtributo(attributeEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado la caracteristica ${this.attributeForm.value.atributo}`,
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
