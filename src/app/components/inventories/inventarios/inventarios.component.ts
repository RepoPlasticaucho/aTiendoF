import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faTable } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { InventariosEntity } from 'src/app/models/inventarios';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {

  ///Iconos para la pagina de grupos
  inventarioAlamacenNombre = localStorage.getItem('almacenInventarioNombre')!;
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faTable = faTable;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];

  constructor(private readonly httpService: InventariosService,
    private router: Router) { }

  ngOnInit(): void {
    const component = this;
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      pageLength: 50,
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

        $('#dtdt tbody').on('click', '.delete-icon', function () {
          const inventario: InventariosEntity = $(this).closest("span").data('inventario');
          component.eliminarInventarios(inventario);
          return;
        });
        $('#dtdt tbody').on('click', '.edit-icon', function () {
          const inventario: InventariosEntity = $(this).closest("span").data('inventario');
          component.editarInventarios(inventario);
          return;
        });


      }

    }
    const almacen: AlmacenesEntity = {
      idAlmacen: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      sociedad_id: '',
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpService.obtenerPortafolios(almacen).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
              // timer: 3000
            });
          } else {
            this.lstInventarios = res.lstInventarios;
            console.log(this.lstInventarios);
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

    /*
    // Agrega un controlador de clic usando delegación de eventos
    document.getElementById('tabla-contenedor')?.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target && target.classList.contains('btn-danger')) {
          // Identifica el botón de eliminación
          // Puedes acceder a los datos de la fila haciendo referencia al elemento padre
          const row = target.closest('tr');
          const rowIndex = row ? row.rowIndex : -3;

          if (rowIndex >= 0) {
              // Acción de eliminación aquí, usa rowIndex para acceder a los datos
              const inventario = this.lstInventarios[rowIndex -3];
              this.deshabilitarInventarios(inventario);
          }
      }
  });
  */

  }

  eliminarInventarios(inventario: InventariosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${inventario.Producto}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarInventarios(inventario).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${inventario.Producto}`,
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

  navegar() {
    let ruta = this.router.url;

    if (ruta.includes('navegation-cl')) {
      this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-productos'] } }]);
    }

    if (ruta.includes('navegation-facturador')) {
      this.router.navigate(['/navegation-facturador']);
    }
  }

  exportarAXLSX() {
    const movimientosSinProductId = this.lstInventarios.map(movimiento => {
      const { ...movimientoSinProductId } = movimiento;
      return movimientoSinProductId;
    });



    const renombrar = movimientosSinProductId.map(movimiento => {
      return {
        'PRODUCTO': movimiento.producto_nombre,
        'CATEGORIA': movimiento.categoria,
        'LINEA': movimiento.linea,
        'MARCA': movimiento.marca,
        'MODELO': movimiento.modelo,
        'COLOR': movimiento.color,
        'CARACTERISTICA': movimiento.atributo,
        'GENERO': movimiento.genero,
        'ETIQUETAS': movimiento.etiquetas,
        'STOCK': movimiento.stock,
        'PRECIO': movimiento.pvp2,
        'COSTO': movimiento.costo,
        'UNIDAD DE MEDIDA': movimiento.unidad_medidad,
        'TAMAÑO': movimiento.talla,
        'IVA': movimiento.tarifa_ice_iva,
        'ICE': movimiento.tarifa_ice_iva1,
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


    this.saveExcelFile(excelBuffer, `${this.inventarioAlamacenNombre}_${fecha}.xlsx`);



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

  deshabilitarInventarios(inventario: InventariosEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${inventario.Producto}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.deshabilitarInventarios(inventario).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${inventario.Producto}`,
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

  agregarProductos() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-create'] } }]);
  }

  editarInventarios(inventario: InventariosEntity) {
    console.log(inventario);
    this.httpService.asignarInventario(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-edit'] } }]);
  }
}
