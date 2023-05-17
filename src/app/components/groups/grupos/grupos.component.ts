import { Component, OnDestroy, OnInit } from '@angular/core';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { GruposEntity } from 'src/app/models/grupos';
import { GruposService } from 'src/app/services/grupos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit, OnDestroy {
  //Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstGrupos: GruposEntity[] = [];

  constructor(private readonly httpService: GruposService,
    private router: Router) { }

  ngOnInit(): void {

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: true
    }

    this.httpService.obtenerGrupos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstGrupos = res.lstGrupos;
        this.dtTrigger.next('');
      }
    })
  }

  editarGrupos(grupo: GruposEntity): void {
    this.httpService.asignarGrupo(grupo);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarGrupos'] } }]);
  }

  eliminarGrupos(grupo: GruposEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${grupo.grupo}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarGrupo(grupo).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${grupo.grupo}`,
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

  agregarProducto() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearGrupos'] } }]);
  }

}
