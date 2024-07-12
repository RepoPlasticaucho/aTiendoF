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
  selector: 'app-almacenesegresos',
  templateUrl: './almacenesegresos.component.html',
  styleUrls: ['./almacenesegresos.component.css']
})
export class AlmacenesegresosComponent implements OnInit {

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


  

  abrirVista(almacen: AlmacenesEntity) {

    localStorage.setItem('almacenid', almacen.idAlmacen)
    localStorage.setItem('almacenNombreUsuario', almacen.nombre_almacen!)

    const newMovimiento: MovimientosEntity = {
      almacen_id: localStorage.getItem('almacenid')!,
      id: '',
      tipo_id: '2',
      tipo_emision_cod: '',
      estado_fact_id: '1',
      tipo_comprb_id: '1',
      cod_doc: '',
      secuencial: ''
    }
    //localStorage.setItem('idfiscalCl', '');
    this.httpServicemov.agregarMovimiento(newMovimiento).subscribe(res => {
      if (res.codigoError == "OK") {
        
        // localStorage.setItem('tipo', this.pedidoForm.value.tipo!)
        // this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['menuvent'] } }]);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      }
      this.httpServicemov.obtenerMovimientoUno(newMovimiento).subscribe(res1 => {
        console.log(res1)
        if (res1.codigoError == "OK") {
          localStorage.setItem('movimiento_id', res1.lstMovimientos[0].id);
          localStorage.setItem('estab', res1.lstMovimientos[0].estab!);       
          
          //Obtener la ruta actual y segun la ruta redirigir a la pagina de menu de ventas
          let ruta = this.router.url;

          if(ruta.includes('navegation-cl')){
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['menuvent'] } }]);
          }

          if(ruta.includes('navegation-facturador')){
            this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['menuvent'] } }]);
          }
          
        }
      })
    })
  }
}
