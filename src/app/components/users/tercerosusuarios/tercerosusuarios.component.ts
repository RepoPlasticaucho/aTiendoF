import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faTable } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { TercerosEntity } from 'src/app/models/terceros';
import { TercerosService } from 'src/app/services/terceros.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-tercerosusuarios',
  templateUrl: './tercerosusuarios.component.html',
  styleUrls: ['./tercerosusuarios.component.css']
})
export class TercerosusuariosComponent implements OnInit {

   ///Iconos para la pagina de grupos
   faUserFriends = faUserFriends;
   faEdit = faEdit;
   faTrashAlt = faTrashAlt;
   faPlus = faPlus;
   faTable = faTable;
   //Declaración de variables
   dtOptions: DataTables.Settings = {};
   dtTrigger: Subject<any> = new Subject<any>();
   lstTerceros: TercerosEntity[] = [];

  constructor(private readonly httpService: TercerosService,
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
      responsive:  true
    }

    const tercero : TercerosEntity = {
      id: '',
      almacen_id: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      sociedad_id: '1',
      tipotercero_id: '',
      tipousuario_id: '',
      nombresociedad: '',
      nombrealmacen: '',
      nombretercero: '',
      tipousuario: '',
      nombre: '',
      id_fiscal: '',
      direccion: '',
      telefono: '',
      correo: '',
      fecha_nac: '',
      ciudad: '',
      provincia: '',
      ciudadid: '',
    }

    //
    this.httpService.obtenerTodosTerceros(tercero).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.dtTrigger.next('');
        this.lstTerceros = res.lstTerceros;

        console.log("AQUI TODOS TERCEROOOS", this.lstTerceros);
      }
    })



  }

  eliminarTercero(tercero: TercerosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar al usuario: ${tercero.nombre}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarTerceros(tercero).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado la categoria ${tercero.nombre}`,
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

  agregarTerceros() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['tercerosusuarios-create'] } }]);
  }

  editarTerceros(tercero: TercerosEntity) {
    console.log(tercero);
    this.httpService.asignarTercero(tercero);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['tercerosusuarios-edit'] } }]);
  }

  exportarAXLSX() {



    const renombrar = this.lstTerceros.map(movimiento => {
      return {
        'NOMBRES': movimiento.nombre,
        'IDENTIFICACION': movimiento.id_fiscal,
        'CORREO': movimiento.correo,
        'PROVEINCIA': movimiento.provincia,
        'CIUDAD': movimiento.ciudad,
        'DIRECCION': movimiento.direccion,
        'FECHA DE NACIMIENTO': movimiento.fecha_nac,
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
    XLSX.utils.book_append_sheet(wb, wsData, 'Proveedores');

    // Generar el archivo Excel y guardarlo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fecha = `${day}-${month}-${year}`;


    this.saveExcelFile(excelBuffer, `Terceros__${fecha}.xlsx`);



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
