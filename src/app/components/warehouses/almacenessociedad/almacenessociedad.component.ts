import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faTable } from '@fortawesome/free-solid-svg-icons';
import { Session } from 'inspector';
import { Subject } from 'rxjs';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-almacenessociedad',
  templateUrl: './almacenessociedad.component.html',
  styleUrls: ['./almacenessociedad.component.css']
})
export class AlmacenessociedadComponent implements OnInit {

  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faTable = faTable;
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
          $('#dtdt tbody').on('click', '.editar-icon', function () {
          //BOTON EDITAR
          console.log('editar');
          const almacen = $(this).closest('span').data('almacen');
          component.editarAlmacenes(almacen);
          return;

        });
        $('#dtdt tbody').on('click', '.delete-icon', function () {
          //BOTON ELIMINAR
          const almacen = $(this).closest('span').data('almacen');
          component.eliminarAlmacenes(almacen);
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
      password: '',
      funcion: '',
      tipo_ambienteid: '',
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

  eliminarAlmacenes(almacen: AlmacenesEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${almacen.nombre_almacen}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarAlmacen(almacen).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${almacen.direccion}`,
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

  agregarAlmacenes() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['crearAlmacenes'] } }]);
  }

  editarAlmacenes(almacen: AlmacenesEntity) {
    console.log('editar');
    console.log(almacen);
    this.httpService.asignarAlmacen(almacen);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['editarAlmacenes'] } }]);
  }

  exportarAXLSX() {


    const renombrar = this.lstAlmacenes.map(movimiento => {
      return {
        'NOMBRE': movimiento.nombre_almacen,
        'DIRECCION': movimiento.direccion,
        'TELEFONO': movimiento.telefono,
        'CODIGO': movimiento.codigo,
        'PTO DE EMISION': movimiento.pto_emision,

      };
    });

    const wb = XLSX.utils.book_new();
    const wsData = XLSX.utils.json_to_sheet(renombrar);

    // Establecer estilos y colores antes de agregar datos
    wsData['!cols'] = [
      { width: 20 },
      { width: 20 },
      { width: 20 },
      { width: 20 }
    ];



    // Agregar los datos de la tabla
    XLSX.utils.sheet_add_json(wsData, renombrar, { origin: 'A1' });

    // Agregar la hoja de Excel al libro
    XLSX.utils.book_append_sheet(wb, wsData, 'Movimientos');

    // Generar el archivo Excel y guardarlo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fecha = `${day}-${month}-${year}`;


    this.saveExcelFile(excelBuffer, `ALMACENES_${fecha}.xlsx`);



  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  }

}
