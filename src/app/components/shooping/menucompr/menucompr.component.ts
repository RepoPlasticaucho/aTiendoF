import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { faShoppingBag, faSave, faList, faTimes, faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { CompraNuevoComponent } from '../compra-nuevo/compra-nuevo.component';
import '../../../../../src/disable-alerts';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';

@Component({
  selector: 'app-menucompr',
  templateUrl: './menucompr.component.html',
  styleUrls: ['./menucompr.component.css']
})
export class MenucomprComponent implements OnInit {
  editarDetalle: boolean = false;
  selectTipo: boolean = false;

  clienteForm = new FormGroup({
    tipo: new FormControl('0', Validators.required)
  });

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faCheck = faCheck;
  faSave = faSave;
  faShoppingCart = faShoppingCart;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  faShoppingBag = faShoppingBag;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstDetalleMovimientos: DetallesMovimientoEntity[] = [];
  sumaTotal: any;
  detalleEditIndex: number = -1;
  detalleEditBackup: DetallesMovimientoEntity | null = null;
  formGroup: any;

  constructor(private dialog: MatDialog,
    private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceMov: MovimientosService,
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
      info: false,
      responsive: true,
    }
    
    this.cargarTablaMenucompr();

  }

  changeGroup(tipoC: any): void {
    if (tipoC.target.value == 0) {
      this.selectTipo = true;
    } else {
      this.selectTipo = false;
    }
  }

  /*
  realizarAccion() {
    console.log(localStorage.getItem('movimiento_id'))
    const selectedOption = this.clienteForm.get('tipo')!.value;
    if (selectedOption === 'CONSUMIDOR FINAL') {
      const newMovimiento: MovimientosEntity = {
        id: localStorage.getItem('movimiento_id')!,
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '',
        tipo_comprb_id: '',
        almacen_id: localStorage.getItem('almacenid')!,
        cod_doc: '',
        secuencial: ''
      }
      this.httpServiceMov.actualizarTerceroPedido(newMovimiento).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Ha ocurrido un error',
            showConfirmButton: true,
            // timer: 3000
          });
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Información',
            text: 'Se ha elegido al Consumidor Final',
            showConfirmButton: true,
            // timer: 3000
          });
        }
      });
    } else if (selectedOption === 'CLIENTE') {
      // Realizar acción para el cliente
      // Por ejemplo:
      console.log('Seleccionó Cliente');
    } else {
      // Acción por defecto o error
    }
  }

  */

  verCarrito() {
    const dialogRef = this.dialog.open(CompraNuevoComponent, {
      width: '900px',
      
      // Agrega cualquier configuración adicional del modal aquí
    });
  
    dialogRef.componentInstance.productoAgregado.subscribe((producto: any) => {
      // Actualizar la tabla
      this.cargarTablaMenucompr();
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }
  
  cargarTablaMenucompr(){
    const newDetalle: DetallesMovimientoEntity = {
      id: '',
      producto_nombre: '',
      inventario_id: '',
      producto_id: '',
      movimiento_id: localStorage.getItem('movimiento_id')!,
      cantidad: '',
      costo: '',
      precio: ''
    }

    this.httpService.obtenerDetalleMovimiento(newDetalle).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'info',
          title: 'Información',
          text: 'Empieza tu pedido en "AÑADIR".',
          showConfirmButton: true,
          // timer: 3000
        });
      } else {
        this.lstDetalleMovimientos = res.lstDetalleMovimientos;
        this.dtTrigger.next('');
        this.calcularSumaTotal();
        Swal.close();
      }
    });
  }


  calcularSumaTotal() {
    const suma = this.lstDetalleMovimientos.reduce((total, detalleMovimientos) => {
      return total + parseFloat(detalleMovimientos.precio.replace(',', '.'));
    }, 0);

    this.sumaTotal = suma.toLocaleString(undefined, { minimumFractionDigits: 2 }).replace('.', ',');
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

  editarDetalleMovimiento(index: number): void {
    this.detalleEditIndex = index;
    this.detalleEditBackup = { ...this.lstDetalleMovimientos[index] };
    this.editarDetalle = true;
  }

  aplicarCambiosDetalle(index: number): void {
    //this.guardarDetalleMovimiento();
    if (this.detalleEditIndex >= 0 && this.detalleEditBackup) {
      // Realizar lógica de guardado o actualización del detalle en tu servicio
      // Por ejemplo:
      this.httpService.modificarDetallePedido(this.lstDetalleMovimientos[this.detalleEditIndex]).subscribe(res => {
        if (res.codigoError == 'OK') {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se han guardado los cambios del detalle`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).then(() => {
            this.editarDetalle = false;
            this.detalleEditIndex = -1;
            this.detalleEditBackup = null;
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        }
      });
    }
  }

  calcularPrecio(index: number): void {
    const detalleMovimientos = this.lstDetalleMovimientos[index];
    const cantidad = parseFloat(detalleMovimientos.cantidad);
    const costo = parseFloat(detalleMovimientos.costo);
  
    if (!isNaN(cantidad) && !isNaN(costo)) {
      detalleMovimientos.precio = (cantidad * costo).toFixed(2);
    } else {
      detalleMovimientos.precio = '';
    }
  
    this.calcularSumaTotal();
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }

  onInput2(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9.]/g, ''); // Filtra solo números y punto
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
              this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['ver-factura'] } }]);
            });
          
      } else if (result.isDenied) {
        Swal.fire('No se finalizó la compra', '', 'info')
      }
    });
  }



}

