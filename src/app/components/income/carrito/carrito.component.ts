import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  faShoppingCart = faShoppingCart;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  sumaTotal: any;

  constructor(private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMovimiento: MovimientosService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: true,
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
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se está cargando el detalle.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
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

  verPortafolios(event: Event) {
    event.preventDefault();
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }

  editarDetalle(detalle: DetallesMovimientoEntity): void {
    this.httpService.asignarDetalle(detalle);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios-editar'] } }]);
  }

  eliminarDetalle(detalle: DetallesMovimientoEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${detalle.producto_nombre}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarDetallePedido(detalle).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el producto ${detalle.producto_nombre}`,
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

  calcularSumaTotal() {
    const suma = this.lstDetalleMovimientos.reduce((total, detalleMovimientos) => {
      return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
    }, 0);
  
    this.sumaTotal = suma.toLocaleString(undefined, { minimumFractionDigits: 2 }).replace('.', ',');
  }

  finalizarPedido(){
    Swal.fire({
      title: '¿Estás seguro de terminar la compra?',
      showDenyButton: true,
      confirmButtonText: 'SÍ',
      denyButtonText: `NO`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
            Swal.fire({
              icon: 'success',
              title: 'Finalizado Correctamente.',
              text: `Se ha finalizado la compra`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              // this.groupForm.reset();
              this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['vistafactura'] } }]);
            });
          
      } else if (result.isDenied) {
        Swal.fire('No se finalizó la compra', '', 'info')
      }
    });
  }

}
