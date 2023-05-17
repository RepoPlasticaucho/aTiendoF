import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faCopy, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias-create',
  templateUrl: './categorias-create.component.html',
  styleUrls: ['./categorias-create.component.css']
})
export class CategoriasCreateComponent implements OnInit {

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
  
  private db: any;

  constructor(private readonly httpService: CategoriasService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.categoryForm.valid) {
      this.categoryForm.markAllAsTouched();
    } else {
      const categoriaEntity: CategoriasEntity = {
        id: "",
        categoria: this.categoryForm.value!.categoria ?? "",
        cod_sap: this.categoryForm.value!.codigoSAP ?? "",
        etiquetas: this.categoryForm.value!.etiquetas ?? "",
        almacen_id: ''
      }
      this.httpService.agregarCategoria(categoriaEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado la categoria ${this.categoryForm.value.categoria}`,
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
      }, () => {
        console.log("No se pudo Guardar Información");
        this.httpService.agregarCategoriaBDD(categoriaEntity);
      })
    }
  }

  visualizarCategorias(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['categorias'] } }]);
  }
}
