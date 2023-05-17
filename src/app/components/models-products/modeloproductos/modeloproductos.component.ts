import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faList, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modeloproductos',
  templateUrl: './modeloproductos.component.html',
  styleUrls: ['./modeloproductos.component.css']
})
export class ModeloproductosComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstModelosProductos: ModeloProductosEntity[] = [];

  constructor(private readonly httpService: ModeloproductosService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive: true
    }

    this.httpService.obtenerModelosProductos().subscribe(res => {
      console.log(res);
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstModelosProductos = res.lstModelo_Productos;
        this.dtTrigger.next('');
      }
    })
  }

  editarModeloProducto(modeloProducto: ModeloProductosEntity): void {
    this.httpService.asignarModeloProducto(modeloProducto);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarModeloProductos'] } }]);
  }

  eliminarModeloProducto(modeloProducto: ModeloProductosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${modeloProducto.modelo_producto}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarModeloProducto(modeloProducto).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el Modelo-Producto ${modeloProducto.modelo_producto}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).then(() => {
              // this.groupForm.reset();
              window.location.reload();
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
    })
  }

  deshabilitarModeloProducto(modeloProducto: ModeloProductosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${modeloProducto.modelo_producto}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.deshabilitarModeloProducto(modeloProducto).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el Modelo-Producto ${modeloProducto.modelo_producto}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).then(() => {
              // this.groupForm.reset();
              window.location.reload();
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
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  agregarModeloProducto() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearModeloProductos'] } }]);
  }

}

