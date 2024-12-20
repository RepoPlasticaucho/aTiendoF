import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { environment } from 'src/environments/environment.prod';
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
  fechaEmision: string = '';
  direccionAlm: string = '';
  dir1: string = '';
  fechaAut = localStorage.getItem('fechaAutoriz')!;
  cliente: string = '';
  idFiscalCliente: string = '';
  email: string = '';
  emiteRetencion: string = '';
  telefono: string = '';
  direccionCl: string = '';
  facturaUrl: any = "https://calidad.atiendo.ec/eojgprlg/FacturasPDF/ejemplo.pdf";
  facturaBase64: string = "";
  facturaName: string = "";
  subtotal0: string = '';
  subtotal12: string = '';
  descuento: string = '';
  ice: string = '0.00';
  //iva: string = '';
  propina: string = '';
  pdfGenerado: boolean = false;
  valorTotal: string = '';
  iva: number = environment.iva;
  ivaCalculado: number = 0;
  obligadoContabilidad: string = '';
  url_logo: string = "";



  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceSociedad: SociedadesService,
    private readonly httpServiceSRI: SriwsService,
    private readonly httpServiceDetallePago: DetallesPagoService,
    private readonly httpServiceAlmacen: AlmacenesService,
    private readonly httpServiceTercero: TercerosService,
    private readonly httpServiceForma: FormasPagoService,
    private httpServiceImage: ImagenesService,
    private router: Router) { }

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
      tipo_ambienteid: '',
      almacen_personal_id: localStorage.getItem('almacenNombreUsuario')!,
    }
    Swal.fire({
      title: 'FACTURA',
      html: 'Se generó la factura correctamente',
      didOpen: () => {
        this.httpServiceTercero.obtenerTerceroCedula(newTercero).subscribe(res1 => {
          if (res1.codigoError != "OK") {
            this.cliente = "Consumidor Final";
            this.telefono = "9999999999";
            this.email = "consumidorfinal@hotmail.com";
            this.direccionCl = "Sin dirección";
            this.idFiscalCliente = "Sin identificación"
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
            this.facturaNro =  res1.lstMovimientos[0].estab! + '-' + res1.lstMovimientos[0].pto_emision  + '-' + res1.lstMovimientos[0].secuencial;
            this.claveAcceso = res1.lstMovimientos[0].clave_acceso!;
          }
        });
        // this.httpServiceSociedad.obtenerSociedadDatos(newSociedad).subscribe(res1 => {
        //   if (res1.codigoError != "OK") {

        //   } else {
        //     this.razonSocial = res1.lstSociedades[0].razon_social!;
        //     this.nombreComercial = res1.lstSociedades[0].nombre_comercial!;
        //     this.idFiscalSoc = res1.lstSociedades[0].id_fiscal!;
        //     this.direccionAlm = res1.lstSociedades[0].direccion!;
        //     this.dir1 = res1.lstSociedades[0].dir1!;
        //     this.ambiente = res1.lstSociedades[0].ambiente!;
        //     this.emiteRetencion = res1.lstSociedades[0].emite_retencion! == '2' ? 'SI' : 'NO';
        //     this.obligadoContabilidad = res1.lstSociedades[0].obligado_contabilidad! == '2' ? 'SI' : 'NO';
        //     this.url_logo = res1.lstSociedades[0].url_logo!;

        //   }
        // });

        const almacenNombre = localStorage.getItem('almacenNombreUsuario')!;

        this.httpServiceSociedad.obtenerSociedadDatosAlmacenPrev(newSociedad ).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            this.razonSocial = res1.lstSociedades[0].razon_social!;
            this.nombreComercial = res1.lstSociedades[0].nombre_comercial!;
            this.idFiscalSoc = res1.lstSociedades[0].id_fiscal!;
            this.direccionAlm = res1.lstSociedades[0].direccion!;
            this.dir1 = res1.lstSociedades[0].dir1!;
            this.ambiente = res1.lstSociedades[0].ambiente!;
            this.emiteRetencion = res1.lstSociedades[0].emite_retencion! == '2' ? 'SI' : 'NO';
            this.obligadoContabilidad = res1.lstSociedades[0].obligado_contabilidad! == '2' ? 'SI' : 'NO';
            this.url_logo = res1.lstSociedades[0].url_logo!;

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

            console.log("ESTOS SON LOS DETALLES MOVIEMIENTOS", res.lstDetalleMovimientos)

            this.lstDetalleMovimientos = res.lstDetalleMovimientos;
            this.httpServiceMovimiento.obtenerMovimientoID(newMovimiento).subscribe(res2 => {
              if (res2.codigoError != "OK") {

              } else {
                const fecha = res2.lstMovimientos[0].fecha_emision!;
                /*
                console.log(fecha)
                const fechaEmisionStr: string = fecha[0];
                console.log(fechaEmisionStr)
                const partesFecha: string[] = fechaEmisionStr.split("/");
                console.log(partesFecha)
                const dia: number = parseInt(partesFecha[1], 10);
                const mes: number = parseInt(partesFecha[0], 10) - 1;
                const anio: number = parseInt(partesFecha[2], 10);
                console.log(dia)
                console.log(mes)
                console.log(anio)

                const fechaEmision: Date = new Date(anio, mes, dia);
                console.log(fechaEmision)
                this.fechaEmision = fechaEmision;
                */
                this.fechaEmision = fecha;
                const sub: number = this.calcularTotalTarifa0();
                const numeroFormateado: string = sub.toFixed(2);
                this.subtotal0 = numeroFormateado;
                const sub12: number = this.calcularTotalTarifa12();
                const numeroFormateado2: string = sub12.toFixed(2);
                this.subtotal12 = numeroFormateado2;
                this.descuento = res2.lstMovimientos[0].total_desc!;
                const iva12: number = this.calcularIva12();
                //    const numeroFormateado3: string = iva12.toFixed(2);
                //  console.log("Este es el formateado "+ numeroFormateado3)
                const ivafixed = parseFloat(iva12.toFixed(2));
                this.ivaCalculado = ivafixed
                this.propina = res2.lstMovimientos[0].propina!;
                this.valorTotal = res2.lstMovimientos[0].importe_total!;
              }
            });
          }
        });
      }
    }).finally(() => {
      this.generarPDF();
    });

  }

  calcularIva12(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva + '%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa12 * (this.iva / 100);

    return porcen;
  }


  generarPDF() {

    const DATA = document.getElementById('htmlData')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };


    // Crear un contenedor para renderizar el contenido en tamaño fijo
    const fixedContainer = document.createElement('div');
    fixedContainer.style.width = '794px'; // Ancho en puntos para A4
    fixedContainer.style.position = 'absolute';
    fixedContainer.style.top = '0';
    fixedContainer.style.left = '0';
    fixedContainer.style.background = 'white';

    // Clonar el contenido original y agregarlo al contenedor fijo
    const contentClone = DATA.cloneNode(true) as HTMLElement;
    fixedContainer.appendChild(contentClone);
    document.body.appendChild(fixedContainer);


    html2canvas(fixedContainer, options).then((canvas) => {
  
      const img = canvas.toDataURL('image/PNG');
  
  
      const bufferX = 0;
      const bufferY = 0;

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      //Descargarse y agregar la imagen del logo
      const logoUrl = this.url_logo;
      this.getBase64Image(logoUrl).then((logoBase64) => {
        if (logoBase64) {
          doc.addImage(logoBase64, 'PNG', 10, 10, 70, 70);
        }
      })

      return doc;
    }).then((docResult) => {
      document.body.removeChild(fixedContainer);

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
        // Guardar pdf en local
        //docResult.save(this.facturaName);
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
              this.pdfGenerado = true;
            } else {
              console.log(res1.descripcionError)
            }
          });
      });
    })
  }

  guardarPDF() {

    console.log("ENTRO A GUARDAR PDF")

    const DATA = document.getElementById('htmlData')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      useCORS: true // Para permitir la carga de estilos externos
    };


    // Crear un contenedor para renderizar el contenido en tamaño fijo
    const fixedContainer = document.createElement('div');
    fixedContainer.style.width = '794px'; // Ancho en puntos para A4
    fixedContainer.style.position = 'absolute';
    fixedContainer.style.top = '0';
    fixedContainer.style.left = '0';
    fixedContainer.style.background = 'white';

    // Clonar el contenido original y agregarlo al contenedor fijo
    const contentClone = DATA.cloneNode(true) as HTMLElement;
    fixedContainer.appendChild(contentClone);
    document.body.appendChild(fixedContainer);


    html2canvas(fixedContainer, options).then((canvas) => {
  
      const img = canvas.toDataURL('image/png', 1.0); // Asegúrate de que sea un PNG válido
  
  
      const bufferX = 0;
      const bufferY = 0;

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      doc.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      //Descargarse y agregar la imagen del logo
      const logoUrl = this.url_logo;
      console.log("ESTO ES LO QUE TENGO EN EL LOGO URL " + logoUrl)
      this.getBase64Image(logoUrl).then((logoBase64) => {
        if (logoBase64) {

          console.log("eSTO ES LO QUE TENGO EN EL LOGO " + logoBase64)
          doc.addImage(logoBase64, 'PNG', 10, 10, 70, 70);
        }
      })

      return doc;
    }).then((docResult) => {
      document.body.removeChild(fixedContainer);

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
        // Guardar pdf en local
        docResult.save(this.facturaName);
      
      });
    })
  }

  imprimirComprobante() {
    console.log("Generando PDF");
  
    const DATA = document.getElementById('htmlComprobante')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3,
      useCORS: true // Para permitir la carga de estilos externos
    };


    // Crear un contenedor para renderizar el contenido en tamaño fijo
    const fixedContainer = document.createElement('div');
    fixedContainer.style.width = '794px'; // Ancho en puntos para A4
    fixedContainer.style.position = 'absolute';
    fixedContainer.style.top = '0';
    fixedContainer.style.left = '0';
    fixedContainer.style.background = 'white';

    // Clonar el contenido original y agregarlo al contenedor fijo
    const contentClone = DATA.cloneNode(true) as HTMLElement;
    fixedContainer.appendChild(contentClone);
    document.body.appendChild(fixedContainer);


    html2canvas(fixedContainer, options).then((canvas) => {
  
      const img = canvas.toDataURL('image/png', 1.0); // Asegúrate de que sea un PNG válido
  
  
      const bufferX = 0;
      const bufferY = 0;

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();

      doc.addImage(img, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

      //Descargarse y agregar la imagen del logo
      const logoUrl = this.url_logo;
      console.log("ESTO ES LO QUE TENGO EN EL LOGO URL " + logoUrl)
      this.getBase64Image(logoUrl).then((logoBase64) => {
        if (logoBase64) {

          console.log("eSTO ES LO QUE TENGO EN EL LOGO " + logoBase64)
          doc.addImage(logoBase64, 'PNG', 10, 10, 70, 70);
        }
      })

      return doc;
    }).then((docResult) => {
      document.body.removeChild(fixedContainer);

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
        // Guardar pdf en local
        docResult.save(this.facturaName);
      
      });
    })
  }
  

  // Función para descargar la imagen y convertirla a base64
  getBase64Image(url: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          resolve(dataURL);
        } else {
          reject(null);
        }
      };
      img.onerror = () => reject(null);
      img.src = url;
    });
  }

  enviarComprobante() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['estado-facturas'] } }]);
  }

  // enviarComprobante() {
  //   const movimientoID = localStorage.getItem('movimiento_id')!;
  //   this.httpServiceSRI.enviarComprobanteCorreo(movimientoID).subscribe(res => {
  //     if (res == 'Correo enviado correctamente') {
  //       console.log(res);
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Finalizado Correctamente.',
  //         text: `Se ha finalizado la venta y enviado el comprobante`,
  //         showConfirmButton: true,
  //         confirmButtonText: "Ok"
  //       }).finally(() => {
  //         // this.groupForm.reset();
  //         let ruta = this.router.url;

  //         if (ruta.includes('navegation-cl')) {
  //           this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['ventaprov'] } }]);
  //         }

  //         if (ruta.includes('navegation-facturador')) {
  //           this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['ventaprov'] } }]);
  //         }

  //       });
  //     } else {
  //       console.log(res);
  //     }
  //   });
  // }

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
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva + '%')
      .reduce((total, detalleMovimientos) => {
        console.log(parseFloat(detalleMovimientos.precio.replace(',', '.')))
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa12;
  }

}