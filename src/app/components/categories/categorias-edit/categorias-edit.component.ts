import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias-edit',
  templateUrl: './categorias-edit.component.html',
  styleUrls: ['./categorias-edit.component.css']
})
export class CategoriasEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faCopy = faCopy;
  faSave = faSave;
  //Creación de la variable para formulario
  categoryForm = new FormGroup({
    categoria: new FormControl('', Validators.required),
    codigoSAP: new FormControl('', Validators.required),
    etiquetas: new FormControl('',),
  });
  //Declaracion de variables
  private codigo: string = "";

  constructor(private readonly httpService: CategoriasService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpService.obtenercategoria$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id!;
        this.categoryForm.get("categoria")?.setValue(res.categoria!);
        this.categoryForm.get("codigoSAP")?.setValue(res.cod_sap);
        this.categoryForm.get("etiquetas")?.setValue(res.etiquetas);
      }
    });
  }

  onSubmit(): void {
    if (!this.categoryForm.valid) {
      this.categoryForm.markAllAsTouched();
    } else {
      const categoriaEntity: CategoriasEntity = {
        id: this.codigo,
        categoria: this.categoryForm.value!.categoria ?? "",
        cod_sap: this.categoryForm.value!.codigoSAP ?? "",
        etiquetas: this.categoryForm.value!.etiquetas ?? "",
        almacen_id: ''
      }
      this.httpService.actualizarCategoria(categoriaEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado Correctamente.',
            text: `Se ha actualizado la información`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['categorias'] } }]);
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

  visualizarCategorias(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['categorias'] } }]);
  }

}
