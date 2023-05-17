import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css']
})
export class AlmacenesComponent implements OnInit, OnDestroy {

  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstAlmacenes: AlmacenesEntity[] = [];

  constructor(private readonly httpService: AlmacenesService,
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

    this.httpService.obtenerAlmacenes().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstAlmacenes = res.lstAlmacenes;
        this.dtTrigger.next('');
      }
    })

  }

  eliminarAlmacenes(almacen: AlmacenesEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${almacen.nombresociedad}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarAlmacen(almacen).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${almacen.nombresociedad}`,
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

  agregarAlmacenes() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearAlmacenes'] } }]);
  }

  editarAlmacenes(almacen: AlmacenesEntity) {
    console.log(almacen);
    this.httpService.asignarAlmacen(almacen);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarAlmacenes'] } }]);
  }


}
