import { Component, OnInit } from '@angular/core';
import { faList, faEdit, faTrashAlt, faPlus, faTable } from '@fortawesome/free-solid-svg-icons';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import Swal from 'sweetalert2';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { PersonalService } from 'src/app/services/personal.service';
import { PersonalEntity } from 'src/app/models/personal';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { Almacenes, AlmacenesEntity } from 'src/app/models/almacenes';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-gestionar-personal',
  templateUrl: './gestionar-personal.component.html',
  styleUrls: ['./gestionar-personal.component.css']
})

export class GestionarPersonalComponent implements OnInit {
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faTable = faTable;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstProveedores: PersonalEntity[] = [];
  almacenes: AlmacenesEntity[] = [];

  constructor(private readonly httpService: PersonalService,
    private readonly httpServiceSociedades: SociedadesService,
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

          const data = $(this).closest('span').data('proveedor');
          component.editarPersonal(data);
          return;

        });
        $('#dtdt tbody').on('click', '.delete-icon', function () {
          //BOTON ELIMINAR
          const data = $(this).closest('span').data('proveedor');
          component.eliminarSociedades(data);
          return;

        });
      }
    }

    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los proveedores.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpService.obtenerPersonal(localStorage.getItem('sociedadid') || "").subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstProveedores = res.lstSociedades;
            this.dtTrigger.next('');
            Swal.close();
          }
        });
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  agregarProveedor() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['personal-create'] } }]);
  }

  
  eliminarSociedades(p: PersonalEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${p.nombre_personal}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        //Crear sociedad a partir de la entidad personal

        const sociedad : SociedadesEntity ={
          idGrupo: '',
          idSociedad: p.idSociedad,
          razon_social: '',
          nombre_comercial: '',
          id_fiscal: '',
          email: '',
          telefono: '',
          tipo_ambienteid: '',
          password: '',
          funcion: ''
        }

        this.httpServiceSociedades.eliminarSociedad(sociedad).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${sociedad.nombre_comercial}`,
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



  editarPersonal(proveedor: PersonalEntity): void {

    this.httpService.asignarPersonal(proveedor);
    // console.log(producto);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['personal-edit'] } }]);
  }
  

  exportarAXLSX() {

    
    const renombrar = this.lstProveedores.map(movimiento => {
        return {
            'NOMBRE': movimiento.nombre_personal,
            'CORREO': movimiento.email,
            'TELEFOO': movimiento.telefono,
            'ALMACEN': movimiento.almacen_personal_id,
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

    // Fusionar celdas para el título general "Movimientos"
    wsData['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];
    //Agregar estilos a la fusionada
    wsData['A1'].s = {
      font: { bold: true, sz: 24 },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: {
          patternType: 'solid',
          fgColor: { rgb: 'FFFF00' } // Aquí puedes especificar el color de fondo que desees, por ejemplo, amarillo (FFFF00)
      }
  };

    // Establecer el título general "Movimientos" en la fila 1
    wsData['A1'] = { v: `Personal`, t: 's' };
    
    // Establecer estilos para el título
    wsData['A1'].s = {
      font: { bold: true, sz: 24 },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: {
          patternType: 'solid',
          fgColor: { rgb: 'FFFF00' } // Aquí puedes especificar el color de fondo que desees, por ejemplo, amarillo (FFFF00)
      }
  };

    // Agregar los datos de la tabla
    XLSX.utils.sheet_add_json(wsData, renombrar, { origin: 'A2' });

    // Agregar la hoja de Excel al libro
    XLSX.utils.book_append_sheet(wb, wsData, 'Persoanl');

    // Generar el archivo Excel y guardarlo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fecha = `${day}-${month}-${year}`;


    this.saveExcelFile(excelBuffer, `Personal_${fecha}.xlsx`);


    
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
