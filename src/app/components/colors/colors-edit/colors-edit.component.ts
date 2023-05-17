import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faTimes, faShoppingCart, faSave } from '@fortawesome/free-solid-svg-icons';
import { ColorsEntity } from 'src/app/models/colors';
import { ColoresService } from 'src/app/services/colores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-colors-edit',
  templateUrl: './colors-edit.component.html',
  styleUrls: ['./colors-edit.component.css']
})
export class ColorsEditComponent implements OnInit {
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
  //Declaracion de variables
  private codigo: string = "";

  constructor(private readonly httpService: ColoresService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpService.obtenercolor$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id;
        this.colorForm.get("color")?.setValue(res.color);
        this.colorForm.get("codigoSAP")?.setValue(res.cod_sap);
        this.colorForm.get("etiquetas")?.setValue(res.etiquetas);
      }
    });
  }

  onSubmit(): void {
    if (!this.colorForm.valid) {
      this.colorForm.markAllAsTouched();
    } else {
      const colorEntity: ColorsEntity = {
        id: this.codigo,
        color: this.colorForm.value!.color ?? "",
        cod_sap: this.colorForm.value!.codigoSAP ?? "",
        etiquetas: this.colorForm.value!.etiquetas ?? ""
      }
      this.httpService.actualizarcolor(colorEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado Correctamente.',
            text: `Se ha actualizado la información`,
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
