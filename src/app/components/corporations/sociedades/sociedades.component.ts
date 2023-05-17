import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sociedades',
  templateUrl: './sociedades.component.html',
  styleUrls: ['./sociedades.component.css']
})
export class SociedadesComponent implements OnInit, OnDestroy {

  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstSociedades: SociedadesEntity[] = [];


  constructor(private readonly httpService: SociedadesService,
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

    this.httpService.obtenerSociedades().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstSociedades = res.lstSociedades;
        this.dtTrigger.next('');
      }
    })

  }

  eliminarSociedades(sociedad: SociedadesEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${sociedad.nombre_comercial}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarSociedad(sociedad).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${sociedad.nombre_comercial}`,
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

  agregarSociedades() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearSociedades'] } }]);
  }

  editarSociedades(sociedad: SociedadesEntity) {
    console.log(sociedad);
    this.httpService.asignarSociedad(sociedad);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarSociedades'] } }]);
  }

}
