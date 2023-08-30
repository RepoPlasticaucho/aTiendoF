import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subject } from 'rxjs';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { DetallesPagoEntity } from 'src/app/models/detalles-pago';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { TercerosEntity } from 'src/app/models/terceros';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { DetallesPagoService } from 'src/app/services/detalles-pago.service';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { FormasPagoService } from 'src/app/services/formas-pago.service';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { SriwsService } from 'src/app/services/sriws.service';
import { TercerosService } from 'src/app/services/terceros.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {
  @ViewChild('contentToPrint', { static: false }) contentToPrint!: ElementRef;

  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstDetallePagos: DetallesPagoEntity[] = [];
  lstFormasPago: FormasPagoEntity[] = [];
  lstFormasPago2: FormasPagoEntity[] = [];
  razonSocial: string = '';
  nombreComercial: string = '';
  claveAcceso: string = '';
  facturaNro: string = '';
  idFiscalSoc: string = '';
  ambiente: string = '';
  numFactura: string = '';
  fechaEmision: Date | undefined;
  direccionAlm: string = '';
  dir1: string = '';
  fechaAut = localStorage.getItem('fechaAutoriz')!;
  cliente: string = '';
  idFiscalCliente: string = '';
  email: string = '';
  telefono: string = '';
  direccionCl: string = '';
  facturaUrl: any = "https://calidad.atiendo.ec/eojgprlg/FacturasPDF/ejemplo.pdf";
  facturaBase64: string = "";
  facturaName: string = "";
  subtotal0: string = '';
  subtotal12: string = '';
  descuento: string = '';
  ice: string = '0.00';
  iva: string = '';
  propina: string = '';
  valorTotal: string = '';

  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceSociedad: SociedadesService,
    private readonly httpServiceSRI: SriwsService,
    private readonly httpServiceDetallePago: DetallesPagoService,
    private readonly httpServiceAlmacen: AlmacenesService,
    private readonly httpServiceTercero: TercerosService,
    private readonly httpServiceForma: FormasPagoService,
    private httpServiceImage: ImagenesService) { }

  ngOnInit(): void {
    const newDetalle: DetallesMovimientoEntity = {
      id: '',
      producto_nombre: '',
      inventario_id: '',
      producto_id: '',
      movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
      cantidad: '',
      costo: '',
      precio: ''
    }
    const newAlmacen: AlmacenesEntity = {
      idAlmacen: localStorage.getItem('almacenid')!,
      sociedad_id: '',
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    const newTercero: TercerosEntity = {
      almacen_id: '',
      sociedad_id: '',
      tipotercero_id: '',
      tipousuario_id: '',
      nombresociedad: '',
      nombrealmacen: '',
      nombretercero: '',
      tipousuario: '',
      nombre: '',
      id_fiscal: localStorage.getItem('idfiscalCl')!,
      direccion: '',
      telefono: '',
      correo: '',
      fecha_nac: '',
      ciudad: '',
      provincia: '',
      ciudadid: ''
    }
    const newMovimiento: MovimientosEntity = {
      id: localStorage.getItem('movimiento_id')!,
      tipo_id: '',
      tipo_emision_cod: '',
      estado_fact_id: '',
      tipo_comprb_id: '',
      almacen_id: '',
      cod_doc: '',
      secuencial: ''
    }
    const newSociedad: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      telefono: '',
      password: '',
      funcion: '',
      tipo_ambienteid: ''
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se está cargando el detalle.',
      timer: 30000,
      didOpen: () => {
        this.httpServiceTercero.obtenerTerceroCedula(newTercero).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.cliente = res1.lstTerceros[0].nombre;
            this.telefono = res1.lstTerceros[0].telefono;
            this.email = res1.lstTerceros[0].correo;
            this.direccionCl = res1.lstTerceros[0].direccion;
            this.idFiscalCliente = res1.lstTerceros[0].id_fiscal;
          }
        });
        this.httpServiceMovimiento.obtenerMovimientoCLAVEACCESO(newMovimiento).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.facturaNro = res1.lstMovimientos[0].pto_emision + '-' + res1.lstMovimientos[0].estab! + '-' + res1.lstMovimientos[0].secuencial;
            this.claveAcceso = res1.lstMovimientos[0].clave_acceso!;
          }
        });
        this.httpServiceSociedad.obtenerSociedadDatos(newSociedad).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.razonSocial = res1.lstSociedades[0].razon_social!;
            this.nombreComercial = res1.lstSociedades[0].nombre_comercial!;
            this.idFiscalSoc = res1.lstSociedades[0].id_fiscal!;
            this.direccionAlm = res1.lstSociedades[0].direccion!;
            this.dir1 = res1.lstSociedades[0].dir1!;
            this.ambiente = res1.lstSociedades[0].ambiente!;
          }
        });
        
        this, this.httpServiceDetallePago.obtenerDetallePagoMovimiento(newMovimiento).subscribe(res => {
          if (res.codigoError != "OK") {

          } else {
            this.lstDetallePagos = res.lstDetallePagos;
          }
        })
        this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'No existe nada en el carrito.',
              text: res.descripcionError,
              showConfirmButton: false,
              // timer: 3000
            });
          } else {
            this.lstDetalleMovimientos = res.lstDetalleMovimientos;
            Swal.close();
            this.httpServiceMovimiento.obtenerMovimientoID(newMovimiento).subscribe(res2 => {
              if (res2.codigoError != "OK") {
    
              } else {
                const fecha: string[] = res2.lstMovimientos[0].fecha_emision!.split(' ');
                const fechaEmisionStr: string = fecha[0];
                const partesFecha: string[] = fechaEmisionStr.split("/");
                const dia: number = parseInt(partesFecha[0], 10);
                const mes: number = parseInt(partesFecha[1], 10) - 1; // Los meses en JavaScript son indexados desde 0
                const anio: number = parseInt(partesFecha[2], 10);
    
                const fechaEmision: Date = new Date(anio, mes, dia);
                this.fechaEmision = fechaEmision;
                const sub: number = this.calcularTotalTarifa0();
                const numeroFormateado: string = sub.toFixed(2);
                this.subtotal0 = numeroFormateado;
                const sub12: number = this.calcularTotalTarifa12();
                const numeroFormateado2: string = sub12.toFixed(2);
                this.subtotal12 =  numeroFormateado2;
                this.descuento = res2.lstMovimientos[0].total_desc!;
                const iva12: number = this.calcularIva12();
                const numeroFormateado3: string = iva12.toFixed(2);
                this.iva = numeroFormateado3;
                this.propina = res2.lstMovimientos[0].propina!;
                this.valorTotal = res2.lstMovimientos[0].importe_total!;
              }
            });
          }
        });
      },
    });
    
  }

  calcularIva12(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '12%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa12 * 0.12;

    return porcen;
  }

  generarPDF() {
    // Extraemos el
    const DATA = document.getElementById('htmlData')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');

      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      // Guardar pdf en local

      docResult.save(`${new Date().toISOString()}_tutorial.pdf`);
      // Datos para guardar el pdf en remoto

      const pdfContent = doc.output('datauristring');
      const pdfBase64 = pdfContent.split(',')[1];
      const pdfBase64URL = `data:application/pdf;base64,${pdfBase64}`;
      const pdfBase641 = pdfBase64URL.split(',')[1];
      this.facturaBase64 = pdfBase641;

      const newMov: MovimientosEntity = {
        id: localStorage.getItem('movimiento_id')!,
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '',
        tipo_comprb_id: '',
        almacen_id: '',
        cod_doc: '',
        secuencial: ''
      }
      this.httpServiceMovimiento.obtenerMovimientoCLAVEACCESO(newMov).subscribe(res => {
        this.facturaName = `factura_${res.lstMovimientos[0].clave_acceso}.pdf`;
        const imageEntity: ImagenesEntity = {
          imageBase64: this.facturaBase64,
          nombreArchivo: this.facturaName,
          codigoError: '',
          descripcionError: '',
          nombreArchivoEliminar: '',
        };
        this.httpServiceImage
          .agregarPDF(imageEntity).subscribe(res1 => {
            if (res1.codigoError == 'OK') {
              console.log('CORRECTO')

            } else {
              console.log(res1.descripcionError)
            }
          });
      });
    })
  }

  calcularTotalTarifa0(): number {
    const totalTarifa0 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '0%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa0;
  }

  calcularTotalTarifa12(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '12%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa12;
  }

}
