import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faClipboardList, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { LineasEntity } from 'src/app/models/lineas';
import { LineasService } from 'src/app/services/lineas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.css']
})
export class LineasComponent implements OnInit {
  ///Iconos para la pagina de grupos
  faClipboardList = faClipboardList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstLineas: LineasEntity[] = [];

  constructor(private readonly httpService: LineasService,
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

    this.httpService.obtenerLineas().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstLineas = res.lstLineas;
        this.dtTrigger.next('');
      }
    })

  }

  eliminarLineas(linea: LineasEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${linea.linea}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarLinea(linea).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la línea ${linea.linea}`,
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

  agregarLineas() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearLineas'] } }]);
  }

  editarLineas(linea: LineasEntity) {
    this.httpService.asignarLinea(linea);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarLineas'] } }]);
  }

}
