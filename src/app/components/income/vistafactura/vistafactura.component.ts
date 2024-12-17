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

@Component({
  selector: 'app-vistafactura',
  templateUrl: './vistafactura.component.html',
  styleUrls: ['./vistafactura.component.css']
})
export class VistafacturaComponent implements OnInit {

  faFileInvoice = faFileInvoice;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  sumaTotal: any;
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

  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private readonly httpServiceSociedad: SociedadesService,
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
    const newSociedad: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid')!,
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      email: '',
      tipo_ambienteid: '',
      telefono: '',
      password: '',
      funcion: ''
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
        this.httpServiceSociedad.obtenerUser(newSociedad).subscribe(res1 => {
          if(res1.codigoError != "OK"){

          } else {
            this.nombreGrupo = res1.lstSociedades[0].nombreGrupo!;
            this.idFiscal = res1.lstSociedades[0].id_fiscal_grupo!;
            this.numFactura = localStorage.getItem('movimiento_id')!;
            this.cliente = res1.lstSociedades[0].nombre_comercial;
            this.telefono = res1.lstSociedades[0].telefono;
            this.email = res1.lstSociedades[0].email;
            this.idFiscalCliente = res1.lstSociedades[0].id_fiscal;
          }
        })
        this.httpServiceMovimiento.obtenerMovimientoID(newMovimiento).subscribe(res2 => {
          if(res2.codigoError != "OK"){

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
    const suma = this.lstDetalleMovimientos.reduce((total, detalleMovimientos) => {
      return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
    }, 0);
  
    this.sumaTotal = suma.toLocaleString(undefined, { minimumFractionDigits: 2 }).replace('.', ',');
  }

  finalizarPedido(){
    this.httpServiceMovimiento.obtenerUltimoSecuencial(localStorage.getItem('almacenid')!).subscribe(res1 => {
      if (res1.codigoError == 'OK') {
        this.ultSecuencial = res1.lstMovimientos[0].secuencial;
        const numero = parseInt(this.ultSecuencial,10)
        const num2 = numero + 1;
        this.secuencial = num2.toString().padStart(9, '0')
        console.log(this.secuencial)
      }
      const newPedido: MovimientosEntity = {
        id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '2',
        tipo_comprb_id: '',
        almacen_id: '',
        cod_doc: '',
        secuencial: this.secuencial,
        estab: localStorage.getItem('estab')!,
        importe_total: this.sumaTotal
      }
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
                this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['almaceningresos'] } }]);
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

}
