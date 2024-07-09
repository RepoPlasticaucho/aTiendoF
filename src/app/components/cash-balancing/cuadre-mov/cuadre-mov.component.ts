import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faShoppingBag, faTimes, faShoppingCart, faTable } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MenuventComponent } from '../../all_components';
import { MovimientosService } from 'src/app/services/movimientos.service';
import * as XLSX from 'xlsx';
import { FormasPagoServiceSociedad } from 'src/app/services/formaspagosociedad.service';
import { FormasPagoSociedadEntity } from 'src/app/models/formas-pago-sociedad';
import { SociedadesEntity } from 'src/app/models/sociedades';

@Component({
  selector: 'app-cuadre-mov',
  templateUrl: './cuadre-mov.component.html',
  styleUrls: ['./cuadre-mov.component.css']
})
export class CuadreMovComponent implements OnInit {
  tipoPago: string = '';
  showValorAgregado: boolean = true;
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;
  faTable = faTable;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstMovimientos: MovimientosEntity[] = [];
  metodoPago: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MenuventComponent>,
    private router: Router,
    private httpsMovimientosService: MovimientosService,
    private formasPagoServiceSociedad: FormasPagoServiceSociedad
  ) {
    this.tipoPago = data.tipoPago;
  }

  ngOnInit(): void {

    //1.Obtener las formas de pago de la sociedad
    
    const sociedadid: SociedadesEntity = {
      idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
      idGrupo: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      tipo_ambienteid: '',
      telefono: '',
      password: '',
      funcion: '',
      razon_social: '',
      url_certificado: '',
      clave_certificado: ''
    }


    this.formasPagoServiceSociedad.obtenerFormasPago(sociedadid).subscribe((res) => {
      if (res.codigoError != 'OK') {
        
      } else {
        console.log("Aqui formas de pago", res.lstFormasPagoSociedad)
      }
    });


    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: false,
      info: true,
      responsive: true
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        const almacen = localStorage.getItem('nombrealmacen')!;
        const fechadesde = localStorage.getItem('fechadesde')!;
        const fechahasta = localStorage.getItem('fechahasta')!;
        const sociedadid = localStorage.getItem('sociedadid')!;
        if (this.tipoPago == '1' || this.tipoPago == '2' || this.tipoPago == '3') {
          if (this.tipoPago == '1'){
            this.metodoPago = 'PAGO EN EFECTIVO';
          } else if (this.tipoPago == '2'){
            this.metodoPago = 'PAGO POR TARJETA DE DÉBITO';
          } else if (this.tipoPago == '3'){
            this.metodoPago = 'PAGO POR TARJETA DE CRÉDITO';
          }
          if (almacen != '' && fechadesde != '' && fechahasta != '') {
            this.httpsMovimientosService.obtenerMovimientosAlmacenFechaPAGO(almacen, fechadesde, fechahasta, this.tipoPago).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                console.log("Aqui lstMovimientos", this.lstMovimientos)

                this.lstMovimientos.forEach((movimiento, index) => {
                  // Generar el número de factura
                  const numeroFactura = `${movimiento.pto_emision}-${movimiento.camp_ad1!}-${movimiento.secuencial}`;
                  console.log("Aqui numero factura" , numeroFactura)
                  // Asignar el número de factura al objeto de movimiento
                  movimiento.nroFactura = numeroFactura;
              
                  // Opcional: también puedes asignar el número de factura directamente a la lista
                  // this.lstMovimientos[index].numeroFactura = numeroFactura;
              });
              
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else if (almacen != '' && fechadesde == '' && fechahasta == '') {
            this.httpsMovimientosService.obtenerMovimientosAlmacenNombrePAGO(almacen, this.tipoPago).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;

                this.lstMovimientos.forEach((movimiento, index) => {
                  console.log("Aquiiii")

                  // Generar el número de factura
                  const numeroFactura = `${movimiento.pto_emision}-${movimiento.camp_ad1!}-${movimiento.secuencial}`;
                  console.log("Aqui numero factura" , numeroFactura)
                  // Asignar el número de factura al objeto de movimiento
                  movimiento.nroFactura = numeroFactura;
              
                  // Opcional: también puedes asignar el número de factura directamente a la lista
                  // this.lstMovimientos[index].numeroFactura = numeroFactura;
              });
              console.log("Aqui lstMovimientos", this.lstMovimientos)

              
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else if (almacen == '' && fechadesde != '' && fechahasta != '') {
            this.httpsMovimientosService.obtenerMovimientosFechasPAGO(sociedadid, fechadesde, fechahasta, this.tipoPago).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                console.log("Aqui lstMovimientos", this.lstMovimientos)

                this.lstMovimientos.forEach((movimiento, index) => {
                  // Generar el número de factura
                  const numeroFactura = `${movimiento.pto_emision}-${movimiento.camp_ad1!}-${movimiento.secuencial}`;
                  console.log("Aqui numero factura" , numeroFactura)
                  // Asignar el número de factura al objeto de movimiento
                  movimiento.nroFactura = numeroFactura;
              
                  // Opcional: también puedes asignar el número de factura directamente a la lista
                  // this.lstMovimientos[index].numeroFactura = numeroFactura;
              });
              
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else if (almacen == '' && fechadesde == '' && fechahasta == '') {
            this.httpsMovimientosService.obtenerMovimientosTodosPAGO(sociedadid, this.tipoPago).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                console.log("Aqui lstMovimientos", this.lstMovimientos)

                this.lstMovimientos.forEach((movimiento, index) => {
                  // Generar el número de factura
                  const numeroFactura = `${movimiento.pto_emision}-${movimiento.camp_ad1!}-${movimiento.secuencial}`;
                  // Asignar el número de factura al objeto de movimiento 
                  movimiento.nroFactura = numeroFactura;
              
                  // Opcional: también puedes asignar el número de factura directamente a la lista
                  // this.lstMovimientos[index].numeroFactura = numeroFactura;
              });
              
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener movimientos.',
              text: '',
              showConfirmButton: false,
            });
            this.cerrarDialog();
          }
        } else if (this.tipoPago == '4') {
          this.showValorAgregado = false;
          this.metodoPago = 'PAGOS GENERALES'
          if (almacen != '' && fechadesde != '' && fechahasta != '') {
            this.httpsMovimientosService.obtenerMovimientosAlmacenFecha(almacen, fechadesde, fechahasta).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else if (almacen != '' && fechadesde == '' && fechahasta == '') {
            this.httpsMovimientosService.obtenerMovimientosAlmacenNombre(almacen).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                console.log("Aqui lstMovimientos", this.lstMovimientos)

                //res1.lstMovimientos[0].pto_emision + '-' + res1.lstMovimientos[0].estab! + '-' + res1.lstMovimientos[0].secuencial, Asginar el numero de factura a cada factura
                this.lstMovimientos.forEach((movimiento, index) => {
                  // Generar el número de factura
                  const numeroFactura = `${movimiento.pto_emision}-${movimiento.camp_ad1!}-${movimiento.secuencial}`;
                  console.log("Aqui numero factura" , numeroFactura)
                  // Asignar el número de factura al objeto de movimiento
                  movimiento.nroFactura = numeroFactura;
              
                  // Opcional: también puedes asignar el número de factura directamente a la lista
                  // this.lstMovimientos[index].numeroFactura = numeroFactura;
              });
              

                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else if (almacen == '' && fechadesde != '' && fechahasta != '') {
            this.httpsMovimientosService.obtenerMovimientosFechas(sociedadid, fechadesde, fechahasta).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else if (almacen == '' && fechadesde == '' && fechahasta == '') {
            this.httpsMovimientosService.obtenerMovimientosTodos(sociedadid).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener movimientos.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstMovimientos = res1.lstMovimientos;
                console.log("Aqui lstMovimientos", this.lstMovimientos)
                this.lstMovimientos.forEach((movimiento, index) => {
                  // Generar el número de factura
                  const numeroFactura = `${movimiento.pto_emision}-${movimiento.camp_ad1!}-${movimiento.secuencial}`;
                  console.log("Aqui numero factura" , numeroFactura)
                  // Asignar el número de factura al objeto de movimiento
                  movimiento.nroFactura = numeroFactura;
              
                  // Opcional: también puedes asignar el número de factura directamente a la lista
                  // this.lstMovimientos[index].numeroFactura = numeroFactura;
              });
              
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener movimientos.',
              text: '',
              showConfirmButton: false,
            });
            this.cerrarDialog();
          }
        } else {
          console.log('ERROR')
        }
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }
 
  exportarAXLSX() {
    const movimientosSinProductId = this.lstMovimientos.map(movimiento => {
        const { ...movimientoSinProductId } = movimiento;
        return movimientoSinProductId;
    });


    
    const renombrar = movimientosSinProductId.map(movimiento => {
        return {
            'NUMERO DE FACTURA': movimiento.nroFactura,
            'FECHA EMISION': movimiento.updated_at,
            'VALOR ABONADO': movimiento.detalle_pago,
            'TOTAL FACTURA': movimiento.importe_total,
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
    wsData['A1'] = { v: `                                                                   ${this.metodoPago}`, t: 's' };
    
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
    XLSX.utils.book_append_sheet(wb, wsData, 'Movimientos');

    // Generar el archivo Excel y guardarlo
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fecha = `${day}-${month}-${year}`;


    this.saveExcelFile(excelBuffer, `${this.metodoPago}_${fecha}.xlsx`);


    
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
