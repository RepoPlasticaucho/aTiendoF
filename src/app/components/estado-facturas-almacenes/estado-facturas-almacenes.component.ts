import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';

@Component({
  selector: 'app-estado-facturas-almacenes',
  templateUrl: './estado-facturas-almacenes.component.html',
  styleUrls: ['./estado-facturas-almacenes.component.css']
})
export class EstadoFacturasAlmacenesComponent implements OnInit {


  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstAlmacenes: AlmacenesEntity[] = [];

  constructor(private readonly httpService: AlmacenesService,
    private readonly httpServicemov: MovimientosService,
    private router: Router) { }

  ngOnInit(): void {
    const component = this;
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive: {
        details: {
          renderer: function (api: any, rowIdx: any, columns: any) {
            var data = $.map(columns, function (col, i) {
              return col.hidden ?
                '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                '<td>' + col.title + ':' + '</td> ' +
                '<td>' + col.data + '</td>' +
                '</tr>' :
                '';
            }).join('');

            return data ?
              $('<table/>').append(data) :
              false;

          }
        },
      },
      initComplete: function () {
        $('#dataTable tbody').on('click', '.entrar-btn', function () {
          console.log('click');
          let almacen = $(this).closest('a').data('almacen');
          console.log(almacen);
          component.abrirVista(almacen);
      });
    }


    }



    const almacen: SociedadesEntity = {
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      idGrupo: '',
      nombre_comercial: '',
      id_fiscal: '',
      tipo_ambienteid: '',
      email: '',
      telefono: '',
      password: '',
      funcion: '',
      razon_social: ''
    }

    this.httpService.obtenerAlmacenesSociedad(almacen).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstAlmacenes = res.lstAlmacenes;
        this.dtTrigger.next('');
      }

    })

  }

  eliminarDatosCompra() {


    //Eliminar los datos de la factura anterior del localstorage si es que hay
    localStorage.removeItem('nombreCl');
    localStorage.removeItem('idfiscalCl');
    localStorage.removeItem('apellidoCl');
    localStorage.removeItem('ciudadCl');
    localStorage.removeItem('direccionCl');
    localStorage.removeItem('correoCl');
    localStorage.removeItem('telefonoCl');
  }
  

  abrirVista(almacen: AlmacenesEntity) {


    localStorage.setItem('almacenid', almacen.idAlmacen)
    localStorage.setItem('almacenNombreUsuario', almacen.nombre_almacen!)
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['estado-facturas'] } }]);
  }


  
}
