import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { faShoppingBag, faSave, faList, faTimes, faShoppingCart, faEdit, faTrashAlt, faMoneyBillAlt, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { CompraNuevoComponent } from '../compra-nuevo/compra-nuevo.component';
import '../../../../../src/disable-alerts';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { SustentosTributariosService } from 'src/app/services/sustentos-tributarios.service';
import { SustentosTributariosEntity } from 'src/app/models/sustentos_tributarios';
import { DatePipe } from '@angular/common';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';

@Component({
  selector: 'app-menucompr',
  templateUrl: './menucompr.component.html',
  styleUrls: ['./menucompr.component.css'],
  providers: [DatePipe]
})
export class MenucomprComponent implements OnInit {

  clienteForm = new FormGroup({
    tipo: new FormControl('0', Validators.required)
  });

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faCheck = faCheck;
  faSave = faSave;
  faPlus = faPlus;
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
  lstProveedores: ProveedoresEntity[] = [];
  lstProveedores2: ProveedoresEntity[] = [];
  lstSustentos: SustentosTributariosEntity[] = [];
  lstSustentos2: SustentosTributariosEntity[] = [];
  editarDetalle: boolean = false;
  selectTipo: boolean = false;
  disableProveedor: boolean = false;
  autorizacion: string = '';
  comprobante: string = '';
  fechaSeleccionada: Date | null = null;
  fechaFormateada: any = '';

  constructor(private dialog: MatDialog,
    private readonly httpService: DetallesmovimientoService,
    private readonly httpServiceProv: ProveedoresService,
    private readonly httpServiceMov: MovimientosService,
    private readonly httpServiceSus: SustentosTributariosService,
    private datePipe: DatePipe,
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

    this.httpServiceProv.obtenerProveedores().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener proveedores.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProveedores = res.lstProveedores;
      }
    });

    this.httpServiceSus.obtenerSustentos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener sustentos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstSustentos = res.lstSustentos;
      }
    });

    this.cargarTablaMenucompr();
    this.checkRegistros();
  }

  checkRegistros() {
    this.disableProveedor = this.lstDetalleMovimientos.length > 0;
  }

  changeGroup(tipoC: any): void {
    if (tipoC.target.value == 0) {
      this.selectTipo = true;
      localStorage.setItem('proveedorid', '0')
      localStorage.setItem('proveedor','')
    } else {
      this.selectTipo = false;
    }
    const proveedores: ProveedoresEntity = {
      id: '',
      id_fiscal: '',
      ciudadid: '',
      correo: '',
      direccionprov: '',
      nombre: tipoC.target.value,
      telefono: ''
    }

    this.httpServiceProv.obtenerProveedoresN(proveedores).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        localStorage.setItem('proveedorid', res.lstProveedores[0].id);
        localStorage.setItem('proveedor',tipoC.target.options[tipoC.target.selectedIndex].text);
      }
    })
  }

  changeGroup2(sustento: any): void {
    if (sustento.target.value == 0) {
      localStorage.setItem('sustentoid', '0')
    }
    const sustentos: SustentosTributariosEntity = {
      id: '',
      etiquetas: '',
      codigo: '',
      sustento: sustento.target.value,
    }

    this.httpServiceSus.obtenerSustentosN(sustentos).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener el sustento',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        localStorage.setItem('sustentoid', res.lstSustentos[0].id);
      }
    })
  }


  verCarrito() {
    const dialogRef = this.dialog.open(CompraNuevoComponent, {
      width: '900px',
      height: '725px'
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.componentInstance.productoAgregado.subscribe((producto: any) => {
      // Actualizar la tabla
      this.cargarTablaMenucompr();
      this.checkRegistros();
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

  nuevoProducto() {
    const dialogRef = this.dialog.open(NuevoProductoComponent, {
      width: '900px',
      height: '600px'
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

  cargarTablaMenucompr() {
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
        this.disableProveedor = this.lstDetalleMovimientos.length > 0;
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
        this.httpService.eliminarDetalleCompra(detalle).subscribe(res => {
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
      this.httpService.modificarDetalleCompra(this.lstDetalleMovimientos[this.detalleEditIndex]).subscribe(res => {
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

  finalizarPedido() {
    this.fechaFormateada = this.datePipe.transform(this.fechaSeleccionada, 'yyyy-MM-dd');
    Swal.fire({
      title: '¿Estás seguro de terminar la compra?',
      showDenyButton: true,
      confirmButtonText: 'SÍ',
      denyButtonText: `NO`,
    }).then((result) => {
      const newMov: MovimientosEntity = {
        id: localStorage.getItem('movimiento_id')!,
        tipo_id: '',
        tipo_emision_cod: '',
        estado_fact_id: '',
        tipo_comprb_id: '',
        almacen_id: '',
        cod_doc: '',
        secuencial: '',
        proveedor_id: localStorage.getItem('proveedorid')!,
        autorizacion_venta: this.autorizacion,
        comp_venta: this.comprobante,
        fecha_emision: this.fechaFormateada,
        sustento_id: localStorage.getItem('sustentoid')!
      }
      if (result.isConfirmed) {
        this.httpServiceMov.finalizarCompra(newMov).subscribe(res => {
        Swal.fire({
          icon: 'success',
          title: 'Finalizado Correctamente.',
          text: `Se ha finalizado la compra`,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          // this.groupForm.reset();
          //this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['ver-factura'] } }]);
        });
      });
      } else if (result.isDenied) {
        Swal.fire('No se finalizó la compra', '', 'info')
      }
    });
  }

  formatDate(event: any): void {
    // Obtener el valor ingresado por el usuario
    let input = event.target.value;
  
    // Eliminar cualquier carácter que no sea un número
    input = input.replace(/\D/g, '');
  
    // Aplicar el formato deseado
    let formattedDate = '';
    if (input.length > 0) {
      formattedDate += input.slice(0, 2) ; // Primeros dos números
    }
    if (input.length > 2) {
      formattedDate += '-' + input.slice(2, 4); // Siguiente dos números
    }
    if (input.length > 4) {
      formattedDate += '-' + input.slice(4, 8); // Últimos cuatro números
    }
  
    // Actualizar el valor del input con el formato
    event.target.value = formattedDate;
  }
  



}

