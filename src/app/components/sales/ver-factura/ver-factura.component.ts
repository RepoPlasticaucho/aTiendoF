import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { SociedadesService } from 'src/app/services/sociedades.service';
import { faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { TercerosService } from 'src/app/services/terceros.service';
import { TercerosEntity } from 'src/app/models/terceros';
import { FormasPagoService } from 'src/app/services/formas-pago.service';
import { FormasPagoEntity } from 'src/app/models/formas-pago';
import { DetallesPagoEntity } from 'src/app/models/detalles-pago';
import { DetallesPagoService } from 'src/app/services/detalles-pago.service';

@Component({
  selector: 'app-ver-factura',
  templateUrl: './ver-factura.component.html',
  styleUrls: ['./ver-factura.component.css']
})
export class VerFacturaComponent implements OnInit {
  faFileInvoice = faFileInvoice;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  lstFormasPago: FormasPagoEntity[] = [];
  lstFormasPago2: FormasPagoEntity[] = [];
  sumaTotal: any;
  isBotonHabilitado = false;
  resto: any;
  nombreGrupo: string = '';
  idFiscal: string = '';
  numFactura: string = '';
  fechaEmision: string = '';
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


  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceSociedad: SociedadesService,
    private readonly httpServiceDetallePago: DetallesPagoService,
    private readonly httpServiceTercero: TercerosService,
    private readonly httpServiceForma: FormasPagoService,
    private router: Router) { }

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
      responsive: true
    }
    this.httpServiceForma.obtenerFormasPago().subscribe(res => {
      if (res.codigoError == 'OK') {
        this.lstFormasPago = res.lstFormasPago;
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
          console.log(localStorage.getItem('idfiscalCl'))
          if (res1.codigoError != "OK") {

          } else {
            this.nombreGrupo = res1.lstTerceros[0].nombresociedad!;
            this.idFiscal = res1.lstTerceros[0].id_fiscal!;
            this.numFactura = localStorage.getItem('movimiento_id')!;
            this.cliente = res1.lstTerceros[0].nombre;
            this.telefono = res1.lstTerceros[0].telefono;
            this.email = res1.lstTerceros[0].correo;
            this.idFiscalCliente = res1.lstTerceros[0].id_fiscal;
          }
        })
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
            console.log(res);
            this.lstDetalleMovimientos = res.lstDetalleMovimientos;
            this.dtTrigger.next('');
            this.calcularSumaTotal();
            this.resto = parseFloat(this.sumaTotal.replace(',', '.')).toFixed(2);
            this.actualizarColor();
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

  calcularSumaTotal() {
    const totalTarifa12 = this.calcularTotalTarifa12();
    const totalTarifa0 = this.calcularTotalTarifa0();
    const desc = this.calcularDescuento();

    const suma = totalTarifa12 + totalTarifa0 - desc - this.descuentoN;

    this.sumaTotal = suma
      .toLocaleString(undefined, { minimumFractionDigits: 2 })
      .replace('.', ',');
  }

  onInput2(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9.]/g, ''); // Filtra solo números y punto
  }

  validarDescuento() {
    if (this.descuentoP !== null) {
      // Validar que el valor esté entre 1 y 100
      if (this.descuentoP < 1) {
        this.descuentoP = 1;
      } else if (this.descuentoP > 100) {
        this.descuentoP = 100;
      }
    }
    let total = this.calcularSumaTotal();
  }

  calcularSubtotal(): number {
    const subtotal = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return subtotal;
  }

  calcularTotalTarifa12(): number {
    const totalTarifa12 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '12%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa12 * 0.12;

    return totalTarifa12 + porcen;
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

  calcularDescuento(): number {
    const descuento = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.desc_add)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.desc_add!.replace(',', '.'));
      }, 0);

    return descuento;
  }

  calcularTotalTarifa0(): number {
    const totalTarifa0 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === '0%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa0;
  }


  finalizarPedido() {
    const total_si = this.calcularSubtotal();
    const total_desc = this.calcularDescuento() + this.descuentoN;
    const total_imp = this.calcularTotalTarifa12() + this.calcularTotalTarifa0();
    this.httpServiceMovimiento.obtenerUltimoSecuencial().subscribe(res1 => {
      if (res1.codigoError == 'OK') {
        this.ultSecuencial = res1.lstMovimientos[0].secuencial;
        const numero = parseInt(this.ultSecuencial, 10)
        const num2 = numero + 1;
        this.secuencial = num2.toString().padStart(9, '0');
      }
      const newPedido: MovimientosEntity = {
        id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '1',
        tipo_comprb_id: '',
        almacen_id: '',
        total_si: total_si.toString(),
        total_imp: total_imp.toString(),
        total_desc: total_desc.toString(),
        cod_doc: '',
        secuencial: this.secuencial,
        estab: localStorage.getItem('estab')!,
        importe_total: this.sumaTotal.replace(',', '.')
      }
      console.log(newPedido)
      Swal.fire({
        title: '¿Estás seguro de finalizar el pedido?',
        showDenyButton: true,
        confirmButtonText: 'SÍ',
        denyButtonText: `NO`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.httpServiceMovimiento.finalizarPedido(newPedido).subscribe(res => {
            if (res.codigoError == 'OK') {
              Swal.fire({
                icon: 'success',
                title: 'Finalizado Correctamente.',
                text: `Se ha finalizado el pedido`,
                showConfirmButton: true,
                confirmButtonText: "Ok"
              }).finally(() => {
                // this.groupForm.reset();
                this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['almacenegresos'] } }]);
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
        } else if (result.isDenied) {
          Swal.fire('No se finalizó el pedido', '', 'info')
        }
      });
    });
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

  onInput(event: any) {
    const inputElement = event.target as HTMLInputElement;
    let inputValue = inputElement.value;

    // Remover caracteres que no son números o puntos
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Reemplazar 0 al inicio con un punto
    if (inputValue.length > 0 && inputValue.charAt(0) === '0') {
      inputValue = '.' + inputValue.substring(1);
    }
    inputElement.value = inputValue;
  }



  abonar() {
    const monto = document.getElementById('monto') as HTMLInputElement;
    if (parseFloat(monto.value) <= this.sumaTotal.replace(',', '.') && parseFloat(monto.value) <= this.resto) {
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
          Swal.fire({
            icon: 'success',
            title: 'Abonado',
            text: 'Has abonado' + ' ' + '$' + ' ' + monto.value,
            showConfirmButton: false,
          });
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

  actualizarColor() {
    const restoNumerico = parseFloat(this.resto); // Convertir a número

    if (restoNumerico === 0.00) {
      this.inputColor = '#9EF291';
      this.esRestoCero = true;
    } else {
      this.inputColor = '#FF6262';
      this.esRestoCero = false;
    }
  }

}
