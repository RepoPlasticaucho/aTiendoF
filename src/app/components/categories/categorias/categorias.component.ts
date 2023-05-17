import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCopy, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  //Iconos para la pagina de grupos
  faCopy = faCopy;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstCategorias: CategoriasEntity[] = [];

  constructor(private readonly httpService: CategoriasService,
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

    this.httpService.obtenerCategorias().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstCategorias = res.lstCategorias;
        this.dtTrigger.next('');
      }
    })
  }

  editarCategorias(categoria: CategoriasEntity): void {
    this.httpService.asignarCategoria(categoria);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarCategorias'] } }]);
  }

  eliminarCategorias(categoria: CategoriasEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${categoria.categoria}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarCategoria(categoria).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la categoria ${categoria.categoria}`,
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

  agregarCategoria() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearCategorias'] } }]);
  }

}
