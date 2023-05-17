import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faList, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { GenerosEntity } from 'src/app/models/generos';
import { GenerosService } from 'src/app/services/generos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.component.html',
  styleUrls: ['./generos.component.css']
})
export class GenerosComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstGeneros: GenerosEntity[] = [];

  constructor(private readonly httpService: GenerosService,
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

    this.httpService.obtenerGeneros().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstGeneros = res.lstGeneros;
        this.dtTrigger.next('');
      }
    })
  }

  editarGeneros(genero: GenerosEntity): void {
    this.httpService.asignarGenero(genero);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarGeneros'] } }]);
  }

  eliminarGeneros(genero: GenerosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${genero.genero}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarGenero(genero).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el género ${genero.genero}`,
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

  agregarGenero() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearGeneros'] } }]);
  }

}
