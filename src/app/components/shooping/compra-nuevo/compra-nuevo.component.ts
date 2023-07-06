import { Component, OnInit, EventEmitter } from '@angular/core';
import { faShoppingBag, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { MenucomprComponent } from '../menucompr/menucompr.component';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { Subject, finalize, take } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';

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

  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceProductos: ProductosAdminService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private readonly httpServiceInventario: InventariosService,
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
      ordering: true,
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

        const newInventario: InventariosEntity = {
          categoria_id: '',
          categoria: '',
          linea: '',
          modelo: '',
          marca_id: '',
          marca: '',
          modelo_producto_id: '',
          idProducto: '',
          Producto: '',
          id: '',
          dInventario: '',
          producto_id: res.id,
          almacen_id: localStorage.getItem('almacenid')!,
          almacen: '',
          stock_optimo: '',
          fav: '0',
          color: '',
          stock: producto.cantidad!,
          pvp2: this.costo
        }
        this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
          if (res1.codigoError == 'NEXISTE') {
            this.httpServiceInventario.agregarInventario(newInventario).pipe(
              finalize(() => {
                this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res5 => {
                  const newDetalle: DetallesMovimientoEntity = {
                    id: '',
                    producto_nombre: '',
                    inventario_id: res5.lstInventarios[0].id,
                    producto_id: res.id,
                    movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
                    cantidad: producto.cantidad!,
                    costo: this.costo,
                    precio: this.precio
                  }
                  this.httpServiceDetalle.agregarDetalleCompra(newDetalle).subscribe(res4 => {
                    if (res4.codigoError != 'OK') {
                      Swal.fire({
                        icon: 'error',
                        title: 'Ha ocurrido un error.',
                        text: res4.descripcionError,
                        showConfirmButton: false
                      });
                    } else {
                      Swal.fire({
                        icon: 'success',
                        title: 'Se ha agregado al inventario y detalle',
                        text: `Se ha guardado con éxito el producto`,
                        showConfirmButton: true,
                        confirmButtonText: 'Ok',
                      });
                      this.productoAgregado.emit(producto);
                    }
                  });
                });
              })
            ).subscribe(res2 => {
              if (res2.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res2.descripcionError,
                  showConfirmButton: false
                });
              } else {
              }
            });

          } else if (res1.codigoError == 'OK') {
            const newDetalle: DetallesMovimientoEntity = {
              id: '',
              producto_nombre: '',
              inventario_id: res1.lstInventarios[0].id,
              producto_id: res.id,
              movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
              cantidad: producto.cantidad!,
              costo: this.costo,
              precio: this.precio
            }
            this.httpServiceDetalle.agregarDetalleCompras(newDetalle).subscribe(res3 => {
              if (res3.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res3.descripcionError,
                  showConfirmButton: false
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Se ha agregado al detalle',
                  text: `Se ha guardado con éxito el producto`,
                  showConfirmButton: true,
                  confirmButtonText: 'Ok',
                });
                this.productoAgregado.emit(producto);
              }
            });
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

