import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { TercerosEntity } from 'src/app/models/terceros';
import { TercerosService } from 'src/app/services/terceros.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tercerosusuarios',
  templateUrl: './tercerosusuarios.component.html',
  styleUrls: ['./tercerosusuarios.component.css']
})
export class TercerosusuariosComponent implements OnInit {

   ///Iconos para la pagina de grupos
   faUserFriends = faUserFriends;
   faEdit = faEdit;
   faTrashAlt = faTrashAlt;
   faPlus = faPlus;
   //Declaración de variables
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject<any>();
   lstTerceros: TercerosEntity[] = [];

  constructor(private readonly httpService: TercerosService,
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
      responsive:  true
    }

    const tercero : TercerosEntity = {
      id: '',
      almacen_id: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      sociedad_id: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      tipotercero_id: '',
      tipousuario_id: '',
      nombresociedad: '',
      nombrealmacen: '',
      nombretercero: '',
      tipousuario: '',
      nombre: '',
      id_fiscal: '',
      direccion: '',
      telefono: '',
      correo: '',
      fecha_nac: '',
      ciudad: '',
      provincia: '',
      ciudadid: ''
    }
    this.httpService.obtenerTerceros(tercero).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstTerceros = res.lstTerceros;
        this.dtTrigger.next('');
        console.log(this.lstTerceros);
      }
    })

  }

  eliminarTercero(tercero: TercerosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar al usuario: ${tercero.nombre}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarTerceros(tercero).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la categoria ${tercero.nombre}`,
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

  agregarTerceros() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['tercerosusuarios-create'] } }]);
  }

  editarTerceros(tercero: TercerosEntity) {
    console.log(tercero);
    this.httpService.asignarTercero(tercero);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['tercerosusuarios-edit'] } }]);
  }
}
