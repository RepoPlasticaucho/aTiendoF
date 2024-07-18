import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faFileInvoice, faCheck, faSave } from '@fortawesome/free-solid-svg-icons';
import { Subject, finalize } from 'rxjs';
import Swal from 'sweetalert2';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { FormasPagoSociedadEntity } from 'src/app/models/formas-pago-sociedad';

import { TercerosService } from 'src/app/services/terceros.service';
import { TercerosEntity } from 'src/app/models/terceros';
import { FormasPagoService } from 'src/app/services/formas-pago.service';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { DetallesPagoEntity } from 'src/app/models/detalles-pago';
import { DetallesPagoService } from 'src/app/services/detalles-pago.service';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { SriwsService } from 'src/app/services/sriws.service';
import { DataTableDirective } from 'angular-datatables';
import { environment } from 'src/environments/environment.prod';
import { FormasPagoServiceSociedad } from 'src/app/services/formaspagosociedad.service';


@Component({
  selector: 'app-descargar-inventario',
  templateUrl: './descargar-inventario.component.html',
  styleUrls: ['./descargar-inventario.component.css']
})
export class DescargarInventarioComponent implements OnInit {


  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  faEdit = faEdit;
  faCheck = faCheck;
  faSave = faSave;
  faShoppingCart = faShoppingCart;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  dtTrigger: Subject<any> = new Subject<any>();
  dtTrigger2: Subject<any> = new Subject<any>();
  lstDetallePagos: DetallesPagoEntity[] = [];
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstFormasPago: FormasPagoEntity[] = [];
  lstFormasPago2: FormasPagoEntity[] = [];
  sumaTotal: any;
  isBotonHabilitado = false;
  resto: any;
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
  private datatableElement!: DataTableDirective;
  esRestoCero: boolean = false;
  descuentoN: number = 0;
  descuentoP: number = 0;
  totalF: number = 0;
  deshabilitarIn = false;
  editarDetalle: boolean = false;
  detalleEditIndex: number = -1;
  detalleEditBackup: DetallesPagoEntity | null = null;
  valorAnterior: string = '';
  lstFormasPagoSociedad: FormasPagoSociedadEntity[] = [];
  lstFormasPagoAux: FormasPagoEntity[] = [];
  documento: string = '';

  iva=environment.iva;
  
  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceSociedad: SociedadesService,
    private readonly httpServiceSRI: SriwsService,
    private readonly httpServiceDetallePago: DetallesPagoService,
    private readonly httpServiceAlmacen: AlmacenesService,
    private readonly httpServiceTercero: TercerosService,
    private readonly httpServiceForma: FormasPagoService,
    private readonly httpServiceFormaSociedad: FormasPagoServiceSociedad,
    private router: Router) { }

  ngOnInit(): void {
    this.actualizarColor();
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: true
    }
    this.dtOptions2 = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: false,
      ordering: false,
      info: false,
      responsive: true
    }

    //Obtener el total del localstorage

    this.resto = localStorage.getItem('totalDescargar');
    this.sumaTotal = this.resto
    .toLocaleString(undefined, { maximumFractionDigits: 2 })
    .replace('.', ',');

    this.httpServiceForma.obtenerFormasPago().subscribe(res => {
      if (res.codigoError == 'OK') {
        this.lstFormasPagoAux = res.lstFormasPago;

        const sociedad: SociedadesEntity = {
          idSociedad: localStorage.getItem('sociedadid')!,
          razon_social: '',
          nombre_comercial: '',
          id_fiscal: '',
          email: '',
          telefono: '',
          password: '',
          funcion: '',
          tipo_ambienteid: '',
          idGrupo: ''
        }
        this.httpServiceFormaSociedad.obtenerFormasPago(sociedad).subscribe(res => {
          if (res.codigoError == 'OK') {
            this.lstFormasPagoSociedad = res.lstFormasPagoSociedad;
            //Recorrer lstFormasPagoAux y solo sacar los que tengan el mismo codigo de lstFormasPagoSociedad
            this.lstFormasPago = this.lstFormasPagoAux.filter((item) => {
              return this.lstFormasPagoSociedad.some((item2) => {
                return parseInt(item.codigo) === parseInt(item2.forma_pago_id);
              });
            });

          } else {
            console.log('ERROR')
          }
        });

      } else {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Ha ocurrido un error',
          showConfirmButton: true,
        });
      }
    });

 



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
        Swal.showLoading();
        this.httpServiceTercero.obtenerTerceroCedula(newTercero).subscribe(res1 => {
          console.log("ACA RES1"+res1.lstTerceros)
          if (res1.codigoError != "OK") {
            this.cliente = "Consumidor Final";
            this.telefono = "999999999";
            this.email = "99999999";

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
        this, this.httpServiceDetallePago.obtenerDetallePagoMov(newMovimiento).subscribe(res => {
          if (res.codigoError != "OK") {
            this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res1 => {
              if (res1.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'No existe nada en el carrito.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                });
              } else {
                this.lstDetalleMovimientos = res1.lstDetalleMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          } else {
            this.lstDetallePagos = res.lstDetallePagos;
            this.dtTrigger2.next('');
            console.log(this.lstDetalleMovimientos)
            this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res1 => {
              console.log(res1)
              
              if (res1.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'No existe nada en el carrito.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                });
              } else {
                this.lstDetalleMovimientos = res1.lstDetalleMovimientos;
                this.dtTrigger.next('');
                Swal.close();
              }
            });
          }
        })
        
      },
      
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });

  }

  actualizarColor() {
    const restoNumerico = parseFloat(this.resto); // Convertir a número

    if (restoNumerico === 0.00) {
      this.inputColor = '#9EF291';
      this.esRestoCero = true;
    } else {
      this.inputColor = '#F9ED95';
      this.esRestoCero = false;
    }
  }


  changePago(event: any): void {
    const seleccionado = event.target.value;
    this.isBotonHabilitado = seleccionado !== "0";
    const newPago: FormasPagoEntity = {
      id: '',
      nombre: event.target.value,
      codigo: '',
      fecha_inicio: '',
      fecha_fin: '',
      created_at: '',
      updated_at: ''
    }

    this.httpServiceForma.obtenerFormasPagoN(newPago).subscribe(res => {
      if (res.codigoError != 'OK') {
      } else {
        this.lstFormasPago2 = res.lstFormasPago;
      }
    })
  }

  
  abonar() {
    const monto = document.getElementById('monto') as HTMLInputElement;
    if (parseFloat(monto.value) <= this.sumaTotal.replace(',', '.') && parseFloat(monto.value) <= this.resto) {
      //Imprimir lo que esta dentro del if
      console.log('Monto: ' + monto.value);
      console.log('Resto: ' + this.resto);
      console.log('Suma Total: ' + this.sumaTotal);
      

      this.resto = (this.resto - parseFloat(monto.value)).toFixed(2);
      this.actualizarColor();
      const newDetallePago: DetallesPagoEntity = {
        id: '',
        movimiento_id: localStorage.getItem('movimiento_id')!,
        forma_pago_id: this.lstFormasPago2[0].id,
        descripcion: 'PAGO',
        valor: monto.value,
        fecha_recaudo: '',
        created_at: '',
        updated_at: ''
      }
      this.httpServiceDetallePago.agregarDetallePago(newDetallePago).subscribe(res => {
        if (res.codigoError == 'OK') {
 
          this.deshabilitarIn = true;
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
          this, this.httpServiceDetallePago.obtenerDetallePagoMov(newMovimiento).subscribe(res => {
            if (res.codigoError != "OK") {
  
            } else {
              this.lstDetallePagos = res.lstDetallePagos;
              this.datatableElement.dtInstance.then((dtInstance2: DataTables.Api) => {
                // Destruye la tabla existente y elimina los datos
                dtInstance2.destroy();
    
                // Renderiza la tabla con los nuevos datos
                this.dtTrigger2.next('');
    
                // Opcional: Reinicia la página a la primera página
                dtInstance2.page('first').draw('page');
              });
            }
          })
          
        } else {
          console.log('ERROR')
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Estás abonando más del resto o has abonado el total',
        showConfirmButton: false,
      });
    }
  }

  descargarInventario() {
    


    
  }

}

