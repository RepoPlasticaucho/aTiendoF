import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faShoppingCart, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ColorsEntity } from 'src/app/models/colors';
import { ColoresService } from 'src/app/services/colores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit {

  //Iconos para la pagina de grupos
  faShoppingCart = faShoppingCart;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstColores: ColorsEntity[] = [];

  constructor(private readonly httpService: ColoresService,
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

    this.httpService.obtenerColores().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstColores = res.lstColors;
        this.dtTrigger.next('');
      }
    })
  }

  editarColores(color: ColorsEntity): void {
    this.httpService.asignarcolor(color);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarColores'] } }]);
  }

  eliminarColores(color: ColorsEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${color.color}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarcolor(color).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el color ${color.color}`,
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

  agregarColor() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearColores'] } }]);
  }

}
