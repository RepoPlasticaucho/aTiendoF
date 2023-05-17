import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faTrashAlt, faPlus, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { MarcasEntity } from 'src/app/models/marcas';
import { MarcasService } from 'src/app/services/marcas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  //Iconos para la pagina de grupos
  faBookmark = faBookmark;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstMarcas: MarcasEntity[] = [];
  //Variables Imagen
  lvUrlImagen: string = "";
  lvNombre: string = "";

  constructor(private readonly httpService: MarcasService,
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

    this.httpService.obtenerMarcas().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstMarcas = res.lstMarcas;
        this.dtTrigger.next('');
      }
    })
  }

  editarMarcas(marca: MarcasEntity): void {
    this.httpService.asignarMarca(marca);
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['editarMarcas'] } }]);
  }

  eliminarMarcas(marca: MarcasEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${marca.marca}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarMarca(marca).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la marca ${marca.marca}`,
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

  agregarMarca() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['crearMarcas'] } }]);
  }

  abrirImagen(marca: MarcasEntity) {
    this.lvUrlImagen = marca.url_image;
    this.lvNombre = marca.marca;
  }

}
