import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faShoppingBag, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ModelosEntity } from 'src/app/models/modelos';
import { ModelosService } from 'src/app/services/modelos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modelos',
  templateUrl: './modelos.component.html',
  styleUrls: ['./modelos.component.css']
})
export class ModelosComponent implements OnInit {
  ///Iconos para la pagina de grupos
  faShoppingBag = faShoppingBag;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstModelos: ModelosEntity[] = [];

  constructor(private readonly httpService: ModelosService,
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

    this.httpService.obtenerModelos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstModelos = res.lstModelos;
        this.dtTrigger.next('');
      }
    })

  }

  eliminarModelos(modelo: ModelosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${modelo.modelo}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarModelo(modelo).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el modelo ${modelo.modelo}`,
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

  agregarModelos() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearModelos'] } }]);
  }

  editarModelos(modelo: ModelosEntity) {
    this.httpService.asignarModelo(modelo);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarModelos'] } }]);
  }

}
