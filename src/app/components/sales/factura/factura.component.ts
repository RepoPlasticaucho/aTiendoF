import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Subject } from 'rxjs';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { MovimientosEntity } from 'src/app/models/movimientos';
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
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstFormasPago: FormasPagoEntity[] = [];
  lstFormasPago2: FormasPagoEntity[] = [];
  sumaTotal: any;
  isBotonHabilitado = false;
  resto: any
  nombreSoc: string = '';
  idFiscalSoc: string = '';
  numFactura: string = '';
  fechaEmision: string = '';
  direccionAlm: string = '';
  telefonoAlm: string = '';
  cliente: string = '';
  idFiscalCliente: string = '';
  email: string = '';
  telefono: string = '';
  ultSecuencial: any = '';
  secuencial: any;
  inputColor: string = '';
  esRestoCero: boolean = false;
  descuentoN: number = 0;
  descuentoP: number = 0;
  totalF: number = 0;
  deshabilitarIn = false;
  facturaUrl: any = "https://calidad.atiendo.ec/eojgprlg/FacturasPDF/ejemplo.pdf";
  facturaBase64: string = "";
  facturaName: string = "";

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
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: false
    }
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
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se está cargando el detalle.',
      timer: 30000,
      didOpen: () => {
        this.httpServiceTercero.obtenerTerceroCedula(newTercero).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.numFactura = localStorage.getItem('movimiento_id')!;
            this.cliente = res1.lstTerceros[0].nombre;
            this.telefono = res1.lstTerceros[0].telefono;
            this.email = res1.lstTerceros[0].correo;
            this.idFiscalCliente = res1.lstTerceros[0].id_fiscal;
          }
        });
        this.httpServiceAlmacen.obtenerAlmacenID(newAlmacen).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.nombreSoc = res1.lstAlmacenes[0].nombresociedad!;
            this.idFiscalSoc = res1.lstAlmacenes[0].idfiscal_sociedad!;
            this.direccionAlm = res1.lstAlmacenes[0].direccion!;
            this.telefonoAlm = res1.lstAlmacenes[0].telefono!;
          }
        });
        this.httpServiceMovimiento.obtenerMovimientoID(newMovimiento).subscribe(res2 => {
          if (res2.codigoError != "OK") {

          } else {
            this.fechaEmision = res2.lstMovimientos[0].fecha_emision!;
          }
        });
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
            this.dtTrigger.next('');
            Swal.close();
          }
        });
      },
    });
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

}
