import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faList, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { AtributosEntity } from 'src/app/models/atributos';
import { AtributosService } from 'src/app/services/atributos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.css']
})
export class AtributosComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstAtributos: AtributosEntity[] = [];

  constructor(private readonly httpService: AtributosService,
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

    this.httpService.obtenerAtributos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstAtributos = res.lstAtributos;
        this.dtTrigger.next('');
      }
    })
  }

  editarAtributos(atributo: AtributosEntity): void {
    this.httpService.asignarAtributo(atributo);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarAtributos'] } }]);
  }

  eliminarAtributos(atributo: AtributosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${atributo.atributo}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarAtributo(atributo).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la caracteristica ${atributo.atributo}`,
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

  agregarAtributo() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearAtributos'] } }]);
  }

}
