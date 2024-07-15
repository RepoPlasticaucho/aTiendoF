import { Component, OnInit, ViewChild } from '@angular/core';
import { faList, faEdit, faTrashAlt, faPlus, faTable } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { FormControl, FormGroup } from '@angular/forms';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement!: DataTableDirective;
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faTable = faTable;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstAuxDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstAlmacenes: AlmacenesEntity[] = [];
  fechaActual: string = '';
  esFacturador: boolean = false;
  nombreAlmacenFacturador: string = '';

  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceAlm: AlmacenesService,
    private router: Router) { }

  filtroForm = new FormGroup({
    almacen: new FormControl('0'),
    fechaDesde: new FormControl(),
    fechaHasta: new FormControl(),
    tipo: new FormControl('0')
  });



  ngOnInit(): void {

    this.rutaFacturador();
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      pageLength: 25,
      search: false,
      searching: true,
      ordering: false,
      info: true
    }

    const almacen: AlmacenesEntity = {
      idAlmacen: localStorage.getItem('almacenid')!,
      sociedad_id: '',
      nombresociedad: '',
      nombre_almacen: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    //Si es un facturador solo se carga del almacen al que pertenece
    if (this.esFacturador) {

      console.log("entro a facturador")
      console.log(localStorage.getItem('almacenid'));

      //Almacen solo con el nombre
      const almacen2: AlmacenesEntity = {
        idAlmacen: '',
        sociedad_id: '',
        nombresociedad: '',
        nombre_almacen: "",
        direccion: '',
        telefono: '',
        codigo: '',
        pto_emision: ''
      }

      //Obtener el nombre del almacen segun el id
      this.httpServiceAlm.obtenerAlmacenId(almacen).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener el nombre del almacen.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {

          almacen2.nombre_almacen = res.lstAlmacenes[0].nombre_almacen;
          this.nombreAlmacenFacturador = almacen2.nombre_almacen!;

          console.log("Este es el almacen 2 " + almacen2.nombre_almacen);

          this.httpService.obtenerDetalleMovimientoAlm(almacen2).subscribe(res => {
            if (res.codigoError != "OK") {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener movimientos.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            } else {
              
        console.log("ENTRO 120")
            
              this.lstDetalleMovimientos = res.lstDetalleMovimientos;
              
              
              this.dtTrigger.next('');

            }
            
          });
          
        }
      });
      this.fechaActual = new Date().toISOString().split('T')[0];

      return
      
    }
    
    
    const sociedadNew: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      tipo_ambienteid: '',
      password: '',
      funcion: ''
    }

    this.httpServiceAlm.obtenerAlmacenesSociedad(sociedadNew).subscribe(res => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        console.log("ENTRO 161")
        
        if(!this.esFacturador){
          this.lstAlmacenes = res.lstAlmacenes;
        }

      }
    });
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los proveedores.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpService.obtenerDetalleMovimientoSociedadDocumento(sociedadNew).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
            console.log("ENTRO 180")

            if(!this.esFacturador){
              this.lstDetalleMovimientos = res.lstDetalleMovimientos;
            }

        
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
    this.fechaActual = new Date().toISOString().split('T')[0];
  }


  
  //Verificar si la ruta es facturador
  rutaFacturador() {
    if (this.router.url.includes('facturador')) {
      this.esFacturador = true;
    }
  }


  // descargarFactura() {
  //   this.facturaService.descargarFactura().subscribe((response: any) => {
  //     const blob = new Blob([response.body], { type: 'application/xml' });
  //     const url = window.URL.createObjectURL(blob);
  //     window.open(url); // abre una nueva pestaña con el archivo descargado
  //   });
  // }
  
  descargarFactura(detalle:string) {
    console.log("Este es el detalle 4 " )

    //Reemplazar .xml por .pdf
    const detalle2 = detalle.replace(".xml",".pdf");
    //Eliminar ftp://
    const detalle3 = detalle2.replace("ftp://","");


    //Agregar /eojgprlg/ despues de calidad.atiendo.ec
    const detalle4 = detalle3.replace("calidad.atiendo.ec","calidad.atiendo.ec/eojgprlg");

    //Reemplazar FacturasXML por FacturasPDF
    const detalle5 = detalle4.replace("FacturasXML","FacturasPDF");

    console.log("Este es el detalle 4 " + detalle5);
    

    //Abrir en una nueva pestaña
    
  }


  changeGroup(tipoC: any): void {
    console.log("SE EJECUTO CHANGEGROUP")
    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('tipo')?.setValue('0');
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('fechaDesde')?.enable();
    const almacen: AlmacenesEntity = {
      idAlmacen: '',
      sociedad_id: '',
      nombresociedad: '',
      nombre_almacen: tipoC.target.value,
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    if (tipoC.target.value == '0') {
      const sociedadNew: SociedadesEntity = {
        idGrupo: '',
        idSociedad: localStorage.getItem('sociedadid')!,
        razon_social: '',
        nombre_comercial: '',
        id_fiscal: '',
        tipo_ambienteid: '',
        email: '',
        telefono: '',
        password: '',
        funcion: ''
      }
      this.httpService.obtenerDetalleMovimientoSociedad(sociedadNew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruye la tabla existente y elimina los datos
            dtInstance.destroy();

            // Renderiza la tabla con los nuevos datos
            this.dtTrigger.next('');

            // Opcional: Reinicia la página a la primera página
            dtInstance.page('first').draw('page');
          });
        }
      });
    } else {
      this.httpService.obtenerDetalleMovimientoAlm(almacen).subscribe(res => {
        if (res.codigoError != "OK") {
          this.filtroForm.get('almacen')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener movimientos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.filtroForm.get('almacen')?.disable();
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;

          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruye la tabla existente y elimina los datos
            dtInstance.destroy();

            // Renderiza la tabla con los nuevos datos
            this.dtTrigger.next('');

            // Opcional: Reinicia la página a la primera página
            dtInstance.page('first').draw('page');
          });
        }
      });
    }
  }

  filterByDate(): void {
    console.log("SE EJECUTO FILTERBYDATE")

    this.filtroForm.get('tipo')?.setValue('0');
    const fechaDesdeControl = this.filtroForm.get('fechaDesde');
    const fechaHastaControl = this.filtroForm.get('fechaHasta');
    const fechaDesde = fechaDesdeControl?.value;
    const fechaHasta = fechaHastaControl?.value;
    const almacen = this.filtroForm.get('almacen')?.value!;
    //if es facturador el nombre es nombreAlmacenFacturador
    if(this.esFacturador){
 
      this.httpService.obtenerDetalleMovimientoAlmF(this.nombreAlmacenFacturador, fechaDesde, fechaHasta).subscribe(res => {
        console.log(res)
        if (res.codigoError != "OK") {
          this.filtroForm.get('almacen')?.enable();
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener movimientos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.filtroForm.get('almacen')?.disable();
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruye la tabla existente y elimina los datos
            dtInstance.destroy();
  
            // Renderiza la tabla con los nuevos datos
            this.dtTrigger.next('');
  
            // Opcional: Reinicia la página a la primera página
            dtInstance.page('first').draw('page');
          });
        }
      });
      return;
    }

    this.httpService.obtenerDetalleMovimientoAlmF(almacen, fechaDesde, fechaHasta).subscribe(res => {
      console.log(res)
      if (res.codigoError != "OK") {
        this.filtroForm.get('almacen')?.enable();
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener movimientos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.filtroForm.get('almacen')?.disable();
        this.lstDetalleMovimientos = res.lstDetalleMovimientos;
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destruye la tabla existente y elimina los datos
          dtInstance.destroy();

          // Renderiza la tabla con los nuevos datos
          this.dtTrigger.next('');

          // Opcional: Reinicia la página a la primera página
          dtInstance.page('first').draw('page');
        });
      }
    });

  }

  changeGroup2(): void {
    console.log("SE EJECUTO CHANGEGROUP2")

    const fechaDesdeControl = this.filtroForm.get('fechaDesde');
    const fechaHastaControl = this.filtroForm.get('fechaHasta');
    const fechaDesde = fechaDesdeControl?.value;
    const fechaHasta = fechaHastaControl?.value;

    //Si es facturador toma nombreAlmacenFacturador si no el valor del select
    const almacen = this.esFacturador ? this.nombreAlmacenFacturador : this.filtroForm.get('almacen')?.value!;
    const tipo = this.filtroForm.get('tipo')?.value!;
    
    if (fechaDesde == null || almacen == null) {
      this.httpService.obtenerDetalleMovimientoAlmTipo(almacen, tipo).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruye la tabla existente y elimina los datos
            dtInstance.destroy();

            // Renderiza la tabla con los nuevos datos
            this.dtTrigger.next('');

            // Opcional: Reinicia la página a la primera página
            dtInstance.page('first').draw('page');
          });
        }
      });
    } else if (fechaDesde != null || almacen == null) {
      this.httpService.obtenerDetalleMovimientoAlmFTipo(almacen, fechaDesde, fechaHasta, tipo).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstDetalleMovimientos = res.lstDetalleMovimientos;
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destruye la tabla existente y elimina los datos
            dtInstance.destroy();

            // Renderiza la tabla con los nuevos datos
            this.dtTrigger.next('');

            // Opcional: Reinicia la página a la primera página
            dtInstance.page('first').draw('page');
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Seleccione un almacén',
        showConfirmButton: false,
      });
    }

  }

  reiniciarFiltros() {
    console.log("SE EJECUTO FILTROSREINI")

    this.filtroForm.get('fechaDesde')?.setValue(null);
    this.filtroForm.get('fechaHasta')?.setValue(null);
    this.filtroForm.get('almacen')?.setValue('0');
    this.filtroForm.get('tipo')?.setValue('0');
    this.filtroForm.get('fechaDesde')?.enable();
    this.filtroForm.get('fechaHasta')?.enable();
    this.filtroForm.get('almacen')?.enable();
    this.filtroForm.get('tipo')?.enable();

    //SI ES FACTURADOR SOLO SE CARGA EL ALMACEN DEL FACTURADOR
    if(this.esFacturador){

        console.log("entro a facturador")
        console.log(localStorage.getItem('almacenid'));
  
        //Almacen solo con el nombre
        const almacen2: AlmacenesEntity = {
          idAlmacen: localStorage.getItem('almacenid')!,
          sociedad_id: '',
          nombresociedad: '',
          nombre_almacen: "",
          direccion: '',
          telefono: '',
          codigo: '',
          pto_emision: ''
        }
  
        //Obtener el nombre del almacen segun el id
        this.httpServiceAlm.obtenerAlmacenId(almacen2).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener el nombre del almacen.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
  
            almacen2.nombre_almacen = res.lstAlmacenes[0].nombre_almacen;
            this.nombreAlmacenFacturador = almacen2.nombre_almacen!;
  
            this.httpService.obtenerDetalleMovimientoAlm(almacen2).subscribe(res => {
              if (res.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos. 6',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              } else {
              
                this.lstDetalleMovimientos = res.lstDetalleMovimientos;
                this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  // Destruye la tabla existente y elimina los datos
                  dtInstance.destroy();
        
                  // Renderiza la tabla con los nuevos datos
                  this.dtTrigger.next('');
        
                  // Opcional: Reinicia la página a la primera página
                  dtInstance.page('first').draw('page');
                });
              }
            });
          }
        });
      return
    }
      
    
    

    const sociedadNew: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      tipo_ambienteid: '',
      email: '',
      telefono: '',
      password: '',
      funcion: ''
    }
    this.httpService.obtenerDetalleMovimientoSociedad(sociedadNew).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstDetalleMovimientos = res.lstDetalleMovimientos;
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destruye la tabla existente y elimina los datos
          dtInstance.destroy();

          // Renderiza la tabla con los nuevos datos
          this.dtTrigger.next('');

          // Opcional: Reinicia la página a la primera página
          dtInstance.page('first').draw('page');
        });
      }
    });
  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  
  exportarAXLSX() {
    const movimientosSinProductId = this.lstDetalleMovimientos.map(movimiento => {
        // Crear un nuevo objeto que excluya la columna product_id
        const { producto_id, modelo_producto_nombre, inventario_id, movimiento_id, tamanio, color, tarifa, desc_add, costo, url_image, created_at, unidad_medida, cod_tarifa, ...movimientoSinProductId } = movimiento;
        return movimientoSinProductId;
    });

    const renombrar = movimientosSinProductId.map(movimiento => {
        // Renombrar las propiedades del objeto
        return {
            'ID': movimiento.id,
            'Nombre Producto': movimiento.producto_nombre,
            'Punto De Emision': movimiento.pto_emision,
            'Tipo De Movimiento': movimiento.tipo_movimiento,
            'Valor Total': movimiento.tipo_movimiento, // Revisar este valor, no parece correcto
            'Cantidad': movimiento.cantidad,
        };
    });

    // Crear un nuevo libro de Excel
    const wb = XLSX.utils.book_new();

    // Convertir los datos de la tabla a una hoja de Excel
    const wsData = XLSX.utils.json_to_sheet(renombrar);

    // Agregar estilos y colores
    wsData['!cols'] = [
        { width: 10 },
        { width: 20 },
        { width: 20 },
        { width: 20 },
        { width: 15 },
        { width: 15 }
    ];

    // Establecer los colores de fondo para las celdas de encabezado
    wsData['A1'].s = { fill: { fgColor: { rgb: 'FFFF0000' } } }; // Rojo
    wsData['B1'].s = { fill: { fgColor: { rgb: 'FF00FF00' } } }; // Verde
    wsData['C1'].s = { fill: { fgColor: { rgb: 'FF0000FF' } } }; // Azul
    wsData['D1'].s = { fill: { fgColor: { rgb: 'FFFFFF00' } } }; // Amarillo
    wsData['E1'].s = { fill: { fgColor: { rgb: 'FFFF00FF' } } }; // Magenta
    wsData['F1'].s = { fill: { fgColor: { rgb: 'FF00FFFF' } } }; // Cian

    // Agregar la hoja de Excel al libro
    XLSX.utils.book_append_sheet(wb, wsData, 'Movimientos');

    // Generar el archivo Excel y guardarlo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fecha = `${day}-${month}-${year}`;


    this.saveExcelFile(excelBuffer, `Movimientos_${fecha}.xlsx`);

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

