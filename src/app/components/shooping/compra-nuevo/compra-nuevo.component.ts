import { Component, OnInit, EventEmitter } from '@angular/core';
import { faShoppingBag, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { MenucomprComponent } from '../menucompr/menucompr.component';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ProveedoresEntity } from 'src/app/models/proveedores';

@Component({
  selector: 'app-compra-nuevo',
  templateUrl: './compra-nuevo.component.html',
  styleUrls: ['./compra-nuevo.component.css']
})
export class CompraNuevoComponent implements OnInit {

  searchText: string = '';
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstProductos: ProducAdmEntity[] = [];

  costo: any;
  precio: any;
  //Variable contenedor id Modelo Producto
  codigo: string = '';
  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceProductos: ProductosAdminService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router,
    private dialogRef: MatDialogRef<MenucomprComponent>,
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: false,
      info: true,
      responsive: true
    }

    const newProveedor: ProveedoresEntity = {
      id: localStorage.getItem('proveedorid')!,
      id_fiscal: '',
      ciudadid: '',
      correo: '',
      direccionprov: '',
      nombre: '',
      telefono: ''
    }

    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        this.httpServiceProductos.obtenerProductosProveedor(newProveedor).subscribe((res1) => {
          if (res1.codigoError != 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener los productos.',
              text: res1.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstProductos = res1.lstProductos;
            this.dtTrigger.next('');
            Swal.close();
          }
        });
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  cerrarDialog(): void {
    this.dialogRef.close();
  }


  crearDetalle(producto: ProducAdmEntity): void {
    this.httpServiceProductos.asignarProducto(producto);
    this.httpServiceProductos.obtenerproducto$.pipe(take(1)).subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        }).finally(() => {
          this.router.navigate([
            '/navegation-cl',
            { outlets: { contentClient: ['menucompr'] } },
          ]);
        });
      } else {
        //Asignamos los valores a los campos
        this.costo = res.pvp;
        this.precio = parseFloat(res.pvp!) * parseFloat(producto.cantidad!);
        this.codigo = res.id!;
        const newDetalle: DetallesMovimientoEntity = {
          id: '',
          producto_nombre: '',
          inventario_id: this.codigo,
          producto_id: res.id,
          movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
          cantidad: producto.cantidad!,
          costo: this.costo,
          precio: this.precio
        }
        this.httpServiceDetalle.agregarDetalleCompra(newDetalle).subscribe(res => {
          if (res.codigoError != 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: 'No existe suficiente stock.',
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Se ha agregado al carrito',
              text: `Se ha guardado con éxito el producto`,
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            });
            this.productoAgregado.emit(producto);
          }
        });
      }
    })
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }
  

}

