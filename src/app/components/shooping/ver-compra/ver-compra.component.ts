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
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-ver-compra',
  templateUrl: './ver-compra.component.html',
  styleUrls: ['./ver-compra.component.css']
})
export class VerCompraComponent implements OnInit {
  faFileInvoice = faFileInvoice;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  sumaTotal: any;
  nombreSoc: string = '';
  nombreProv: string = '';
  idFiscalProv: string = '';
  direccionProv: string = '';
  compVenta: string = '';
  autVenta: string = '';
  fechaEmision: string = '';
  telefonoProv: string = '';
  ultSecuencial: any = '';
  secuencial: any;
  inputColor: string = '';
  totalF: number = 0;
  comprobanteFormato: string = '';
  nombreAlmacenCompra = localStorage.getItem('nombreAlmacenCompra')!;



  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceDetallePago: DetallesPagoService,
    private readonly httpServiceTercero: TercerosService,
    private readonly httpServiceProveedor: ProveedoresService,
    private readonly httpServiceForma: FormasPagoService,
    private router: Router) { }

  iva=environment.iva;

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
    const newProveedor: ProveedoresEntity = {
      id: localStorage.getItem('proveedorid')!,
      id_fiscal: '',
      ciudadid: '',
      sociedad_id: localStorage.getItem('sociedadid')!,
      correo: '',
      direccionprov: '',
      nombre: '',
      telefono: ''
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
        this.httpServiceProveedor.obtenerProveedoresID(newProveedor).subscribe(res1 => {
          if (res1.codigoError != "OK") {

          } else {
            
            this.nombreSoc = res1.lstProveedores[0].nombre_sociedad!;
            this.nombreProv = res1.lstProveedores[0].nombre!;
            this.idFiscalProv = res1.lstProveedores[0].id_fiscal!;
            this.direccionProv = res1.lstProveedores[0].direccionprov!;
            this.telefonoProv = res1.lstProveedores[0].telefono!;
            this.compVenta = localStorage.getItem('compventa')!;
            //Cada 3 digitos agregar un guion en compVenta solo hasta el 7mo digito
            if(this.compVenta.length>6){
              this.comprobanteFormato = this.compVenta.substring(0, 3) + '-' + this.compVenta.substring(3, 6) + '-' + this.compVenta.substring(6);
            }

            this.autVenta = localStorage.getItem('autorizacion')!;
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
    const totalTarifa15 = this.calcularTotalTarifa15();
    const totalTarifa0 = this.calcularTotalTarifa0();
    this.totalF = totalTarifa15 + totalTarifa0;

    const suma = totalTarifa15 + totalTarifa0;

    this.sumaTotal = suma
      .toLocaleString(undefined, { maximumFractionDigits: 2 })
      .replace('.', ',');
  }

  onInput2(event: any) {
    let inputValue = event.target.value;
    const filteredValue = inputValue.replace(/[^0-9.]/g, ''); // Filtra solo números y punto
  
    if (/^\d*\.?\d*$/.test(inputValue) && !filteredValue.startsWith('.')) {
      this.calcularSumaTotal();
    } else {
      event.target.value = inputValue.length === 0 ? '0' : '';
    }
  }
  

  calcularSubtotal(): number {
    const subtotal = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa)
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return subtotal;
  }

  calcularTotalTarifa15P(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);

    return totalTarifa15;
  }
  
  calcularTotalTarifa15(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva/100);

    return totalTarifa15 + porcen;
  }

  calcularIva15(): number {
    const totalTarifa15 = this.lstDetalleMovimientos
      .filter((detalleMovimientos) => detalleMovimientos.tarifa === this.iva+'%')
      .reduce((total, detalleMovimientos) => {
        return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
      }, 0);
    const porcen = totalTarifa15 * (this.iva/100);
    return porcen;
    
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
    const total_imp = this.calcularTotalTarifa15() + this.calcularTotalTarifa0();
    this.httpServiceMovimiento.obtenerUltimoSecuencial(localStorage.getItem('almacenid')!).subscribe(res1 => {
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
        total_desc: '',
        cod_doc: '',
        secuencial: this.secuencial,
        estab: localStorage.getItem('estab')!,
        importe_total: this.sumaTotal.replace(',', '.')
      }
      console.log(newPedido)
      Swal.fire({
        title: '¿Estás seguro de finalizar la compra?',
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
                this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['compraprov'] } }]);
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


}
