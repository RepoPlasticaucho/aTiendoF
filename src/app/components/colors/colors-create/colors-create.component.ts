import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ColorsEntity } from 'src/app/models/colors';
import { ColoresService } from 'src/app/services/colores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-colors-create',
  templateUrl: './colors-create.component.html',
  styleUrls: ['./colors-create.component.css']
})
export class ColorsCreateComponent implements OnInit {
  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faShoppingCart = faShoppingCart;
  faSave = faSave;
  //Creación de la variable para formulario
  colorForm = new FormGroup({
    color: new FormControl('', Validators.required),
    codigoSAP: new FormControl('', Validators.required),
    etiquetas: new FormControl('',),
  });
  constructor(private readonly httpService: ColoresService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.colorForm.valid) {
      this.colorForm.markAllAsTouched();
    } else {
      const colorEntity: ColorsEntity = {
        id: "",
        color: this.colorForm.value!.color ?? "",
        cod_sap: this.colorForm.value!.codigoSAP ?? "",
        etiquetas: this.colorForm.value!.etiquetas ?? ""
      }
      this.httpService.agregarcolor(colorEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el color ${this.colorForm.value.color}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['colores'] } }]);
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

  visualizarColores(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['colores'] } }]);
  }

}
