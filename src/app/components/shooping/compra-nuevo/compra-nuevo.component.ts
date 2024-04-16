import { Component, OnInit, EventEmitter } from '@angular/core';
import { faShoppingBag, faTimes, faShoppingCart, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MenucomprComponent } from '../menucompr/menucompr.component';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { Subject, finalize, take } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { forkJoin } from 'rxjs';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';
import { ProveedoresproductosService } from 'src/app/services/proveedoresproductos.service';
import { ProveedoresProductosEntity } from 'src/app/models/proveedoresproductos';
import { NuevoProductoComponent } from '../nuevo-producto/nuevo-producto.component';
import { DetalleImpuestosEntity } from 'src/app/models/detalle-impuestos';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';

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
  faFolderPlus = faFolderPlus;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstProveedoresProductos: ProveedoresProductosEntity[] = [];

  costo: any;
  costoStatic: any;
  stockStatic: any;
  costo2: any;
  precio: any;
  botonBloqueado: boolean = false;

  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceProductos: ProductosAdminService,
    private dialog: MatDialog,
    private readonly httpServiceProvProd: ProveedoresproductosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private readonly httpServiceInventario: InventariosService,
    private router: Router,
    private readonly httpServiceDetalleImp: DetalleImpuestosService,
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
      pageLength: 100,
      info: true,
      responsive: false
    }

    const newProveedor: ProveedoresProductosEntity = {
      id: '',
      provedor_id: localStorage.getItem('proveedorid')!,
      producto_id: '',
      nombre_producto: '',
      precio: '',
      created_at: '',
      updated_at: ''
    }

    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 20000,
      didOpen: () => {
        Swal.showLoading();
        this.httpServiceProvProd.obtenerProveedoresProductosProv(newProveedor).subscribe((res1) => {
          console.log(res1)
          if (res1.codigoError != 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener los productos.',
              text: res1.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstProveedoresProductos = res1.lstProveedoresProductos;
            this.dtTrigger.next('');
            const batchSize = 10; // Cantidad de productos por lote
            const totalProducts = this.lstProveedoresProductos.length;

            const processBatch = (startIndex: number) => {
              const endIndex = Math.min(startIndex + batchSize, totalProducts);
              const batchObservables = [];

              for (let i = startIndex; i < endIndex; i++) {
                const proveedorProducto = this.lstProveedoresProductos[i];
                const newDetalle: DetallesMovimientoEntity = {
                  id: '',
                  producto_id: proveedorProducto.producto_id,
                  producto_nombre: '',
                  inventario_id: '',
                  movimiento_id: localStorage.getItem('movimiento_id')!,
                  cantidad: '',
                  costo: '',
                  precio: ''
                };

                batchObservables.push(this.httpServiceDetalle.obtenerDetalleMovimientoEx(newDetalle));
              }

              forkJoin(batchObservables).subscribe(responses => {
                responses.forEach((res2, i) => {
                  if (res2.codigoError == 'OK') {
                    this.lstProveedoresProductos[startIndex + i].productoExistente = true;
                    this.lstProveedoresProductos[startIndex + i].cantidad = res2.lstDetalleMovimientos[0].cantidad;
                  } else {
                    this.lstProveedoresProductos[startIndex + i].productoExistente = false;
                  }
                });

                // Procesar el próximo lote si es necesario
                if (endIndex < totalProducts) {
                  processBatch(endIndex);
                } else {
                  // Todos los lotes han sido procesados, cierra el indicador de carga aquí
                  Swal.close();
                }
              });
            };

            processBatch(0); // Comienza el procesamiento del primer lote

          }
        });
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  /*
  const newDetalle: DetallesMovimientoEntity = {
    id: '',
    producto_id: proveedorProducto.producto_id,
    producto_nombre: '',
    inventario_id: '',
    movimiento_id: localStorage.getItem('movimiento_id')!,
    cantidad: '',
    costo: '',
    precio: ''
  };
  */

  cerrarDialog(): void {
    this.dialogRef.close();
  }


  crearDetalle(proveedorProducto: ProveedoresProductosEntity): void {
                    
    if(proveedorProducto.cantidad == "0"){
      Swal.fire({
        icon: 'error',
        title: 'Cantidad 0.',
        text: 'La cantidad del producto no puede ser 0.',
        showConfirmButton: true,
      })
      return
    }
    this.httpServiceProvProd.asignarProveedorProducto(proveedorProducto);
    this.httpServiceProvProd.obtenerProveedorProducto$.pipe(take(1)).subscribe((res) => {
      this.botonBloqueado=true;
      if (res.producto_id == '') {
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
        this.costo = res.precio;
        this.costo2 = res.costo;
        this.precio = parseFloat(res.precio!) * parseFloat(proveedorProducto.cantidad!);

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
          etiquetas: res.etiquetas,
          dInventario: '',
          producto_id: res.producto_id,
          almacen_id: localStorage.getItem('almacenid')!,
          almacen: '',
          stock_optimo: '',
          fav: '0',
          costo: this.costo2,
          color: '',
          stock: proveedorProducto.cantidad!,
          pvp2: this.costo
        }
        // cambios
        //console.log(proveedorProducto.productoExistente)
        
        this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
          if (res1.codigoError == 'NEXISTE') {
            this.httpServiceInventario.agregarInventario(newInventario).pipe(
              finalize(() => {
                this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res5 => {
                  const newDetalle: DetallesMovimientoEntity = {
                    id: '',
                    producto_nombre: '',
                    inventario_id: res5.lstInventarios[0].id,
                    producto_id: res.producto_id,
                    movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
                    cantidad: proveedorProducto.cantidad!,
                    costo: this.costo,
                    precio: this.precio
                  }
                  this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {
                    
                    this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
    
                      if (res1.codigoError == 'OK') {
                        const newDetalleImp: DetalleImpuestosEntity = {
                          id: '',
                          detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                          cod_impuesto: res1.lstDetalleMovimientos[0].cod_tarifa!,
                          porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
                          base_imponible: '',
                          valor: res1.lstDetalleMovimientos[0].costo!,
                          created_at: '',
                          updated_at: ''
                        }
                        this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
                          if (res2.codigoError != 'OK') {
                            Swal.fire({
                              icon: 'error',
                              title: 'Ha ocurrido un error.',
                              text: res2.descripcionError,
                              showConfirmButton: false
                            });
                          }
                        });
                      }
                    });
                  })).subscribe(res4 => {
                    if (res4.codigoError != 'OK') {
                      Swal.fire({
                        icon: 'error',
                        title: 'Ha ocurrido un error.',
                        text: 'La cantidad no puede ser vacía',
                        showConfirmButton: false
                      });
                    } else {
                      Swal.fire({
                        icon: 'success',
                        title: 'Se ha agregado al inventario y detalle',
                        text: `Se ha guardado con éxito el producto`,
                        showConfirmButton: true,
                        confirmButtonText: 'Ok',
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.productoAgregado.emit(proveedorProducto);
                          this.cerrarDialog();
                        }
                      });
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
            this.costoStatic = res1.lstInventarios[0].costo;
            this.stockStatic = res1.lstInventarios[0].stock;
            const oper1 = parseFloat(res1.lstInventarios[0].costo!) * parseFloat(res1.lstInventarios[0].stock!);
            const oper2 = parseFloat(proveedorProducto.cantidad!) * parseFloat(proveedorProducto.costo!);
            const nuevoCosto = (oper1 + oper2) / (parseFloat(res1.lstInventarios[0].stock!) + parseFloat(proveedorProducto.cantidad!));
            const inventarioCosto: InventariosEntity = {
              categoria_id: '',
              categoria: '',
              linea: '',
              modelo: '',
              marca_id: '',
              marca: '',
              modelo_producto_id: '',
              idProducto: '',
              Producto: '',
              costo: nuevoCosto.toString(),
              id: res1.lstInventarios[0].id,
              dInventario: '',
              producto_id: '',
              almacen_id: '',
              almacen: '',
              stock_optimo: '',
              fav: '',
              color: ''
            }
            this.httpServiceInventario.actualizarCosto(inventarioCosto).subscribe(resC => {
              if (resC.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: resC.descripcionError,
                  showConfirmButton: false
                });
              } else {

              }
            });
            const newDetalle: DetallesMovimientoEntity = {
              id: '',
              producto_nombre: '',
              inventario_id: res1.lstInventarios[0].id,
              producto_id: res.producto_id,
              movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
              cantidad: proveedorProducto.cantidad!,
              costo: this.costo,
              precio: this.precio
            }
            if (!proveedorProducto.productoExistente){
              
              this.httpServiceDetalle.agregarDetalleCompras(newDetalle).pipe(finalize(() => {
                this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
                  if (res1.codigoError == 'OK') {
                    const newDetalleImp: DetalleImpuestosEntity = {
                      id: '',
                      detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                      cod_impuesto: res1.lstDetalleMovimientos[0].cod_tarifa!,
                      porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
                      base_imponible: '',
                      valor: res1.lstDetalleMovimientos[0].costo!,
                      created_at: '',
                      updated_at: ''
                    }
                    this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
                      if (res2.codigoError != 'OK') {
                        Swal.fire({
                          icon: 'error',
                          title: 'Ha ocurrido un error.',
                          text: res2.descripcionError,
                          showConfirmButton: false
                        });
                      }
                    });
                  }
                });
              })).subscribe(res3 => {
                if (res3.codigoError != 'OK') {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error.',
                    text: 'La cantidad no puede ser vacía',
                    showConfirmButton: false
                  });
                } else {
                  Swal.fire({
                    icon: 'success',
                    title: 'Se ha agregado al detalle',
                    text: `Se ha guardado con éxito el producto`,
                    showConfirmButton: true,
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    this.botonBloqueado=false;
                    if (result.isConfirmed) {
                      this.productoAgregado.emit(proveedorProducto);
                      this.cerrarDialog();
                    }
                  });
                }
              });
            } else {
              if(proveedorProducto.cantidad! != '0'){
                this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
                  console.log(res.codigoError)
                  if(res.codigoError == 'OK'){
                    Swal.fire({
                      icon: 'success',
                      title: 'Actualizado',
                      text: `Se ha cambiado la cantidad`,
                      showConfirmButton: true,
                      confirmButtonText: 'Ok',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.cerrarDialog();
                      }
                      this.productoAgregado.emit(proveedorProducto);
                    });
                  } else {
                    
                  }
                });
              } else {
                this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
                  console.log("en este metodo"+res)
                  Swal.fire({
                    icon: 'success',
                      title: 'Eliminado',
                      text: `Se ha eliminado el producto del detalle`,
                      showConfirmButton: true,
                      confirmButtonText: 'Ok',
                  }).then(() => {
                    this.cerrarDialog();
                  });
                });
              }
            }
          }
        });
      }
    })
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }

  nuevoProducto() {
    const dialogRef = this.dialog.open(NuevoProductoComponent, {
      width: '900px',
      height: '600px'
      // Agrega cualquier configuración adicional del modal aquí
    });

    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
      this.ngOnInit();
    });
  }

}

