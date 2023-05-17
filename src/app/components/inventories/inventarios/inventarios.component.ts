import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { InventariosEntity } from 'src/app/models/inventarios';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {

  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];

  constructor(private readonly httpService: InventariosService,
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
      responsive:true
    }
    const almacen: AlmacenesEntity = {
      idAlmacen: JSON.parse(localStorage.getItem('almacenid')||"[]"),
      sociedad_id: '',
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    console.log(almacen);

    this.httpService.obtenerPortafolios(almacen).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstInventarios = res.lstInventarios;
        this.dtTrigger.next('');
      }
      
    })

  }

  eliminarInventarios(inventario: InventariosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${inventario.Producto}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarInventarios(inventario).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${inventario.Producto}`,
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

  deshabilitarInventarios(inventario: InventariosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${inventario.Producto}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.deshabilitarInventarios(inventario).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${inventario.Producto}`,
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

  agregarProductos() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-create'] } }]);
  }

  editarInventarios(inventario: InventariosEntity) {
    console.log(inventario);
    this.httpService.asignarInventario(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-edit'] } }]);
  }
}
