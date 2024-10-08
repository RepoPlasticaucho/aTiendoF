import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends,faStore } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios-almacen',
  templateUrl: './inventarios-almacen.component.html',
  styleUrls: ['./inventarios-almacen.component.css']
})
export class InventariosAlmacenComponent implements OnInit {
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
      responsive:  {
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
          $('#dtdt tbody').on('click', '.ver-icon', function () {
          //BOTON EDITAR

          const data = $(this).closest('span').data('almacen');
          component.buscarInventario(data);
          return;

        });
      }
    }

    const almacen: SociedadesEntity = {
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      idGrupo: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      tipo_ambienteid: '',
      password: '',
      funcion: '',
      razon_social: ''
    }
    console.log(almacen);

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

  buscarInventario(almacen: AlmacenesEntity){

    localStorage.setItem('almacenid',almacen.idAlmacen)
    localStorage.setItem('almacenNombreInventarios',almacen.nombre_almacen!)
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido'] } }]);

  }

  vertodos(){

    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-almacenes'] } }]);
  }


}
