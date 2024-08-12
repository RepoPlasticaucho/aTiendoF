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
import { DataTableDirective } from 'angular-datatables';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { ProductossociedadEntity } from 'src/app/models/productossociedad';

@Component({
  selector: 'app-compra-nuevo',
  templateUrl: './compra-nuevo.component.html',
  styleUrls: ['./compra-nuevo.component.css']
})
export class CompraNuevoComponent implements OnInit {

  searchText: string = '';

  isResponsive: boolean = false; // Nueva propiedad
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;
  faFolderPlus = faFolderPlus;
  // Nueva propiedad para las tarjetas de la página actual
  private datatableElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstProveedoresProductos: ProveedoresProductosEntity[] = [];

  costo: any;
  almacenesSociedadId: ProductossociedadEntity[] = [];
  inventarioSociedad: InventariosEntity[] = [];

  costo2: any;
  precio: any;
  botonBloqueado: boolean = false;
  esPlasticaucho: boolean = false;

  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceProductos: ProductosAdminService,
    private dialog: MatDialog,
    private readonly httpServiceProvProd: ProveedoresproductosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private readonly httpServiceInventario: InventariosService,
    private router: Router,
    private readonly httpServiceAlmacenes: AlmacenesService,
    private readonly httpServiceDetalleImp: DetalleImpuestosService,
    private dialogRef: MatDialogRef<MenucomprComponent>,
  ) { }

  anadirTodosProductos(): void {
    for (let producto of this.lstProveedoresProductos) {

      if (parseInt(producto.cantidad!) > 0) {
        console.log("ESTE ES EL PRODUCTO", producto)

        this.crearDetalle(producto);
      }
    }
  }



  ngOnInit(): void {
    let component = this;
    let cantidadAux = "";

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: true,
      searching: true,
      ordering: true,
      pageLength: 20,
      info: false,
      // responsive: {
      //   details: {
      //     renderer: function (api: any, rowIdx: any, columns: any) {
      //       component.isResponsive = true; // Indicar que la tabla está en modo responsive

      //       var data = $.map(columns, function (col, i) {
      //         return col.hidden ?
      //         '<tr data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
      //         '<td>' + col.title + ':' + '</td> ' +
      //         '<td>' + col.data + '</td>' +
      //         '</tr>' :
      //         '';
      //       }).join('');

      //       return data ?
      //         $('<table/>').append(data) :
      //         false;
      //     }
      //   }
      // },
      // initComplete: function () {
      //   $('#dataTable tbody').on('input', 'input', function () {
      //     // Obtener el valor actual del input
      //     console.log("input")
      //     cantidadAux = $(this).val() + ""
      //     console.log(cantidadAux)
      //   });

      //   // Add click event listener to the table rows
      //   $('#dataTable tbody').on('click', 'tr a', function () {
      //     // Solo se ejecuta si esta en responsive
      //     if (component.isResponsive == false) return

      //     let data: ProveedoresProductosEntity = $(this).closest('a').data('proveedor');
      //     data.cantidad = cantidadAux
      //     console.log("Esta es la data", data)
      //     if (cantidadAux == "0") return 
      //     console.log("Se llamo en responsive")
      //     component.crearDetalle(data);
      //     return
      //   });
      // }
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
        if (this.lstProveedoresProductos.length > 0) {
          // Obtener los productos pero no perder los valores de los inputs
          //this.actualizarListaProductos(newProveedor);
          Swal.close();
          return;
        }


        if (localStorage.getItem('proveedor')?.toLocaleLowerCase().includes('plasticaucho')) {
          this.esPlasticaucho = true;
        }


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

            const sociedad: SociedadesEntity = {
              idGrupo: '',
              idSociedad: localStorage.getItem('sociedadid')!,
              razon_social: '',
              nombre_comercial: localStorage.getItem('nombreComercial')!,
              id_fiscal: '',
              email: '',
              telefono: '',
              password: '',
              funcion: '',
              tipo_ambienteid: '',
              ambiente: '',
              email_certificado: '',
              pass_certificado: '',
              sociedad_pertenece: '',
              almacen_personal_id: '',
              emite_retencion: '',
              obligado_contabilidad: '',
              url_logo: ''
            }

            //Obtener todos los productos de la sociedad

            this.httpServiceAlmacenes.obtenerProductoSociedadCosto(sociedad).subscribe(res => {
              if (res.codigoError == 'OK') {

                console.log("ALMACENESssssssSSSsssoooo", res)


                console.log("ALMACENESssssssSSSsssoooo", res.lstProductos)

                this.almacenesSociedadId = res.lstProductos;

                //Recorrer la lista de la sociedad y de los que hayan en la lista de proveedores insertar el costo calculado
                this.almacenesSociedadId.forEach(productoSociedad => {
                  this.lstProveedoresProductos.forEach(productoProveedor => {
                    if (productoSociedad.producto_id == productoProveedor.producto_id) {
                      productoProveedor.costo = productoSociedad.costo
                      productoProveedor.tieneCostoCalculado = true
                    }
                  });
                });

                console.log("ALMACENES SOCIEDAAAAAAAAAAAAA0009AAAAAD", this.almacenesSociedadId)
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener los productos.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              }
            });
            
              

            //Recorrer la lista y de los que hayan en la sociedad insertar el costo calculado

            this.dtTrigger.next('');

            //1. Obtener el detalle movimiento

            const detalleMovimiento: DetallesMovimientoEntity = {
              id: '',
              producto_id: '',
              producto_nombre: '',
              inventario_id: '',
              movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
              cantidad: '',
              costo: '',
              precio: ''
            }

            this.httpServiceDetalle.obtenerDetalleMovimiento(detalleMovimiento).subscribe(res => {
              if (res.codigoError == 'OK') {
                for (let producto of this.lstProveedoresProductos) {
                  for (let detalle of res.lstDetalleMovimientos) {
                    if (producto.producto_id == detalle.producto_id) {
                      producto.cantidad = detalle.cantidad
                      producto.costo = detalle.costo
                      producto.precio = detalle.precio
                      producto.productoExistente = true
                    }
                  }
                }
                Swal.close();

              } else {
                Swal.close();

              }
            })


          }
        }
        );

      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }

  private actualizarListaProductos(newProveedor: ProveedoresProductosEntity): void {
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
        const nuevosProductos = res1.lstProveedoresProductos;
        // Combinar la lista actual con los nuevos productos
        const productosMap = new Map();
        this.lstProveedoresProductos.forEach(producto => productosMap.set(producto.producto_id, producto));
        nuevosProductos.forEach(producto => {
          if (!productosMap.has(producto.producto_id)) {
            productosMap.set(producto.producto_id, producto);
          }
        });
        this.lstProveedoresProductos = Array.from(productosMap.values());
        this.dtTrigger.next('');
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


  // crearDetalle(proveedorProducto: ProveedoresProductosEntity): void {

  //   this.httpServiceProvProd.asignarProveedorProducto(proveedorProducto);
  //   this.httpServiceProvProd.obtenerProveedorProducto$.pipe(take(1)).subscribe((res) => {
  //     this.botonBloqueado = true;
  //     if (res.producto_id == '') {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Ha ocurrido un error.',
  //         text: 'No se ha obtenido información.',
  //         showConfirmButton: false,
  //       }).finally(() => {
  //         this.router.navigate([
  //           '/navegation-cl',
  //           { outlets: { contentClient: ['menucompr'] } },
  //         ]);
  //       });
  //     } else {
  //       //Asignamos los valores a los campos
  //       this.costo = res.costo;
  //       this.costo2 = res.costo;
  //       this.precio = parseFloat(res.costo!) * parseFloat(proveedorProducto.cantidad!);

  //       const newInventario: InventariosEntity = {
  //         categoria_id: '',
  //         categoria: '',
  //         linea: '',
  //         modelo: '',
  //         marca_id: '',
  //         marca: '',
  //         modelo_producto_id: '',
  //         idProducto: '',
  //         Producto: '',
  //         id: '',
  //         etiquetas: res.etiquetas,
  //         dInventario: '',
  //         producto_id: res.producto_id,
  //         almacen_id: localStorage.getItem('almacenid')!,
  //         almacen: '',
  //         stock_optimo: '',
  //         fav: '0',
  //         costo: this.costo2,
  //         color: '',
  //         stock: proveedorProducto.cantidad!,
  //         pvp2: proveedorProducto.precio,
  //         url_image: localStorage.getItem('sociedadid')!
  //       }



  //       // cambios
  //       //console.log(proveedorProducto.productoExistente)

  //       //Cambio stock y costNuevo general
  //       this.httpServiceInventario.obtenerStockTotalSociedad(newInventario).subscribe(res1 => {
  //         if (res1.codigoError == 'NEXISTE') {
  //           console.log("ENTRO AL PRODUCTO NEXISTE1")
  //           this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
  //             if (res1.codigoError == 'NEXISTE') {

  //               console.log("ENTRO AL PRODUCTO NEXISTE2")
  //               this.httpServiceInventario.agregarInventario(newInventario).pipe(
  //                 finalize(() => {
  //                   this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res5 => {
  //                     const newDetalle: DetallesMovimientoEntity = {
  //                       id: '',
  //                       producto_nombre: '',
  //                       inventario_id: res5.lstInventarios[0].id,
  //                       producto_id: res.producto_id,
  //                       movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
  //                       cantidad: proveedorProducto.cantidad!,
  //                       costo: proveedorProducto.costo!,
  //                       precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString()
  //                     }


  //                     this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {

  //                       this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
  //                         if (res1.codigoError == 'OK') {
  //                           const newDetalleImp: DetalleImpuestosEntity = {
  //                             id: '',
  //                             detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
  //                             cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
  //                             codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
  //                             porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
  //                             base_imponible: '',
  //                             valor: res1.lstDetalleMovimientos[0].costo!,
  //                             created_at: '',
  //                             updated_at: ''
  //                           }
  //                           this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
  //                             if (res2.codigoError != 'OK') {
  //                               Swal.fire({
  //                                 icon: 'error',
  //                                 title: 'Ha ocurrido un error.',
  //                                 text: res2.descripcionError,
  //                                 showConfirmButton: false
  //                               });
  //                             }
  //                           });
  //                         }
  //                       });
  //                     })).subscribe(res4 => {
  //                       if (res4.codigoError != 'OK') {
  //                         Swal.fire({
  //                           icon: 'error',
  //                           title: 'Ha ocurrido un error.',
  //                           text: 'La cantidad no puede ser vacía',
  //                           showConfirmButton: false
  //                         });
  //                       } else {

  //                         this.productoAgregado.emit(proveedorProducto);
  //                         this.cerrarDialog();

  //                       }
  //                     });
  //                   });
  //                 })
  //               ).subscribe(res2 => {
  //                 if (res2.codigoError != 'OK') {
  //                   Swal.fire({
  //                     icon: 'error',
  //                     title: 'Ha ocurrido un error.',
  //                     text: res2.descripcionError,
  //                     showConfirmButton: false
  //                   });
  //                 } else {
  //                 }
  //               });
  //             }
  //           });
  //         } else if (res1.codigoError == 'OK') {
  //           //Promedio de los costos de la res1}
  //           console.log("=====]]Entro al OK")

  //           const sumatoriaCostos = res1.lstInventarios.reduce((acc, inv) => {
  //             return acc + parseFloat(inv.costo!);
  //           }, 0);
  //           const costoActual = sumatoriaCostos / res1.lstInventarios.length;
  //           // console.log("=====]]COSTO ACTUAL", costoActual)

  //           //Sumatoria de todo el stock
  //           const existenciaActual = res1.lstInventarios.reduce((acc, inv) => {
  //             return acc + parseFloat(inv.stock!);
  //           }, 0);
  //           // console.log("=====]]STOCK ACTUAL", existenciaActual)


  //           const oper1 = costoActual * existenciaActual;

  //           // console.log("=====]]ProveedorProducto.cantidad", proveedorProducto.cantidad)
  //           // console.log("=====]]ProveedorProducto.costo", proveedorProducto.costo)
  //           const oper2 = parseFloat(proveedorProducto.cantidad!) * parseFloat(proveedorProducto.costo!);
  //           // console.log("=====]]OPER1", oper1)
  //           // console.log("=====]]OPER2", oper2)
  //           // console.log("=====]]Denominador", existenciaActual + parseFloat(proveedorProducto.cantidad!) )
  //           // console.log("=====]]ExistenciaActual", existenciaActual)
  //           // console.log("=====]]ProveedorProducto.cantidad", proveedorProducto.cantidad)
  //           const nuevoCosto = (oper1 + oper2) / (existenciaActual + parseFloat(proveedorProducto.cantidad!));
  //           // console.log("=====]]NUEVO COSTO", nuevoCosto)

  //           //Actualizar el costo de todos los inventarios
  //           res1.lstInventarios.forEach(inventario => {
  //             const inventarioCosto: InventariosEntity = {
  //               categoria_id: '',
  //               categoria: '',
  //               linea: '',
  //               modelo: '',
  //               marca_id: '',
  //               marca: '',
  //               modelo_producto_id: '',
  //               idProducto: '',
  //               Producto: '',
  //               costo: nuevoCosto.toString(),
  //               id: inventario.id,
  //               dInventario: '',
  //               producto_id: '',
  //               almacen_id: '',
  //               almacen: '',
  //               stock_optimo: '',
  //               fav: '',
  //               color: ''
  //             }
  //             this.httpServiceInventario.actualizarCosto(inventarioCosto).subscribe(resC => {
  //               if (resC.codigoError != 'OK') {
  //                 Swal.fire({
  //                   icon: 'error',
  //                   title: 'Ha ocurrido un error.',
  //                   text: resC.descripcionError,
  //                   showConfirmButton: false
  //                 });
  //               } else {
  //                 console.log("Se actualizo el costo")
  //               }
  //             });
  //           });

  //           const newDetalle: DetallesMovimientoEntity = {
  //             id: '',
  //             producto_nombre: '',
  //             inventario_id: res1.lstInventarios[0].id,
  //             producto_id: res.producto_id,
  //             movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
  //             cantidad: proveedorProducto.cantidad!,
  //             costo: proveedorProducto.costo!,
  //             precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString(),
  //             url_image: localStorage.getItem('almacenid')!
  //           }

  //           if (!proveedorProducto.productoExistente) {
  //             if (proveedorProducto.cantidad == "0") {
  //               Swal.fire({
  //                 icon: 'error',
  //                 title: 'No se puede agregar 0',
  //                 text: "La cantidad no puede ser 0",
  //                 showConfirmButton: false
  //               });
  //               this.botonBloqueado = false
  //               return
  //             }

  //             this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
  //               if (res1.codigoError == 'NEXISTE') {

  //                 console.log("ENTRO AL PRODUCTO NEXISTE2")
  //                 this.httpServiceInventario.agregarInventario(newInventario).pipe(
  //                   finalize(() => {
  //                     this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res5 => {
  //                       const newDetalle: DetallesMovimientoEntity = {
  //                         id: '',
  //                         producto_nombre: '',
  //                         inventario_id: res5.lstInventarios[0].id,
  //                         producto_id: res.producto_id,
  //                         movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
  //                         cantidad: proveedorProducto.cantidad!,
  //                         costo: proveedorProducto.costo!,
  //                         precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString()
  //                       }


  //                       this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {

  //                         this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
  //                           if (res1.codigoError == 'OK') {
  //                             const newDetalleImp: DetalleImpuestosEntity = {
  //                               id: '',
  //                               detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
  //                               cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
  //                               codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
  //                               porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
  //                               base_imponible: '',
  //                               valor: res1.lstDetalleMovimientos[0].costo!,
  //                               created_at: '',
  //                               updated_at: ''
  //                             }
  //                             this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
  //                               if (res2.codigoError != 'OK') {
  //                                 Swal.fire({
  //                                   icon: 'error',
  //                                   title: 'Ha ocurrido un error.',
  //                                   text: res2.descripcionError,
  //                                   showConfirmButton: false
  //                                 });
  //                               }
  //                             });
  //                           }
  //                         });
  //                       })).subscribe(res4 => {
  //                         if (res4.codigoError != 'OK') {
  //                           Swal.fire({
  //                             icon: 'error',
  //                             title: 'Ha ocurrido un error.',
  //                             text: 'La cantidad no puede ser vacía',
  //                             showConfirmButton: false
  //                           });
  //                         } else {

  //                           this.productoAgregado.emit(proveedorProducto);
  //                           this.cerrarDialog();

  //                         }
  //                       });
  //                     });
  //                   })
  //                 ).subscribe(res2 => {
  //                   if (res2.codigoError != 'OK') {
  //                     Swal.fire({
  //                       icon: 'error',
  //                       title: 'Ha ocurrido un error.',
  //                       text: res2.descripcionError,
  //                       showConfirmButton: false
  //                     });
  //                   } else {
  //                   }
  //                 });
  //               } else {
  //                 console.log("ENTRO AL PRODUCTO EXISTEEEEEEEEEEEEEEEEEE")
  //                 this.httpServiceDetalle.agregarDetalleCompras(newDetalle).pipe(finalize(() => {

  //                   this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
  //                     if (res1.codigoError == 'OK') {
  //                       const newDetalleImp: DetalleImpuestosEntity = {
  //                         id: '',
  //                         detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
  //                         cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
  //                         codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
  //                         porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
  //                         base_imponible: '',
  //                         valor: res1.lstDetalleMovimientos[0].costo!,
  //                         created_at: '',
  //                         updated_at: ''
  //                       }
  //                       this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
  //                         if (res2.codigoError != 'OK') {
  //                           Swal.fire({
  //                             icon: 'error',
  //                             title: 'Ha ocurrido un error.',
  //                             text: res2.descripcionError,
  //                             showConfirmButton: false
  //                           });
  //                         }
  //                       });
  //                     }
  //                   });
  //                 })).subscribe(res3 => {
  //                   if (res3.codigoError != 'OK') {
  //                     Swal.fire({
  //                       icon: 'error',
  //                       title: 'Ha ocurrido un error.',
  //                       text: 'La cantidad no puede ser vacía',
  //                       showConfirmButton: false
  //                     });
  //                   } else {

  //                     this.botonBloqueado = false;

  //                     this.productoAgregado.emit(proveedorProducto);
  //                     this.cerrarDialog();

  //                   }
  //                 });
  //               }
  //             }
  //             );

  //           } else {

  //             console.log("Entro al error")

  //             if (proveedorProducto.cantidad! != '0' && proveedorProducto.productoExistente) {

  //               console.log("Entro al error")
  //               // //Solo modificamos el detalle que cambio la cantidad

  //               newDetalle.precio = (parseFloat(newDetalle.cantidad!) * parseFloat(newDetalle.costo!)).toString();


  //               this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
  //                 console.log(res.codigoError)
  //                 if (res.codigoError == 'OK') {

  //                   this.cerrarDialog();

  //                   this.productoAgregado.emit(proveedorProducto);

  //                 } else {

  //                 }
  //               });
  //             } else {
  //               this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
  //                 console.log("en este metodo" + res)

  //                 this.cerrarDialog();

  //               });
  //             }
  //           }
  //         }
  //       });


       
  
  crearDetalle(proveedorProducto: ProveedoresProductosEntity): void {

    this.httpServiceProvProd.asignarProveedorProducto(proveedorProducto);
    this.httpServiceProvProd.obtenerProveedorProducto$.pipe(take(1)).subscribe((res) => {
      this.botonBloqueado = true;
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
        this.costo = res.costo;
        this.costo2 = res.costo;
        this.precio = parseFloat(res.costo!) * parseFloat(proveedorProducto.cantidad!);

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
          pvp2: proveedorProducto.precio,
          url_image: localStorage.getItem('sociedadid')!
        }



        // cambios
        //console.log(proveedorProducto.productoExistente)

        //Cambio stock y costNuevo general
        this.httpServiceInventario.obtenerStockTotalSociedad(newInventario).subscribe(res1 => {
          if (res1.codigoError == 'NEXISTE') {
            console.log("ENTRO AL PRODUCTO NEXISTE1")
            this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
              if (res1.codigoError == 'NEXISTE') {

                console.log("ENTRO AL PRODUCTO NEXISTE2")
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
                        costo: proveedorProducto.costo!,
                        precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString()
                      }


                      this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {

                        this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
                          if (res1.codigoError == 'OK') {
                            const newDetalleImp: DetalleImpuestosEntity = {
                              id: '',
                              detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                              cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
                              codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
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

                          this.productoAgregado.emit(proveedorProducto);
                          this.cerrarDialog();

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
              }
            });
          } else if (res1.codigoError == 'OK') {
            //Promedio de los costos de la res1}
            console.log("=====]]Entro al OK")

            const sumatoriaCostos = res1.lstInventarios.reduce((acc, inv) => {
              return acc + parseFloat(inv.costo!);
            }, 0);
            const costoActual = sumatoriaCostos / res1.lstInventarios.length;
            // console.log("=====]]COSTO ACTUAL", costoActual)

            //Sumatoria de todo el stock
            const existenciaActual = res1.lstInventarios.reduce((acc, inv) => {
              return acc + parseFloat(inv.stock!);
            }, 0);
            // console.log("=====]]STOCK ACTUAL", existenciaActual)


            const oper1 = costoActual * existenciaActual;

            // console.log("=====]]ProveedorProducto.cantidad", proveedorProducto.cantidad)
            // console.log("=====]]ProveedorProducto.costo", proveedorProducto.costo)
            const oper2 = parseFloat(proveedorProducto.cantidad!) * parseFloat(proveedorProducto.costo!);
            // console.log("=====]]OPER1", oper1)
            // console.log("=====]]OPER2", oper2)
            // console.log("=====]]Denominador", existenciaActual + parseFloat(proveedorProducto.cantidad!) )
            // console.log("=====]]ExistenciaActual", existenciaActual)
            // console.log("=====]]ProveedorProducto.cantidad", proveedorProducto.cantidad)
            const nuevoCosto = (oper1 + oper2) / (existenciaActual + parseFloat(proveedorProducto.cantidad!));
            // console.log("=====]]NUEVO COSTO", nuevoCosto)

            //Actualizar el costo de todos los inventarios
            res1.lstInventarios.forEach(inventario => {
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
                id: inventario.id,
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
                  console.log("Se actualizo el costo")
                }
              });
            });

            const newDetalle: DetallesMovimientoEntity = {
              id: '',
              producto_nombre: '',
              inventario_id: res1.lstInventarios[0].id,
              producto_id: res.producto_id,
              movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
              cantidad: proveedorProducto.cantidad!,
              costo: proveedorProducto.costo!,
              precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString(),
              url_image: localStorage.getItem('almacenid')!
            }

            if (!proveedorProducto.productoExistente) {
              if (proveedorProducto.cantidad == "0") {
                Swal.fire({
                  icon: 'error',
                  title: 'No se puede agregar 0',
                  text: "La cantidad no puede ser 0",
                  showConfirmButton: false
                });
                this.botonBloqueado = false
                return
              }

              this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
                if (res1.codigoError == 'NEXISTE') {

                  console.log("ENTRO AL PRODUCTO NEXISTE2")
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
                          costo: proveedorProducto.costo!,
                          precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString()
                        }


                        this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {

                          this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
                            if (res1.codigoError == 'OK') {
                              const newDetalleImp: DetalleImpuestosEntity = {
                                id: '',
                                detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                                cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
                                codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
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

                            this.productoAgregado.emit(proveedorProducto);
                            this.cerrarDialog();

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
                } else {

                  const newDetalle2: DetallesMovimientoEntity = {
                    id: '',
                    producto_nombre: '',
                    inventario_id: res1.lstInventarios[0].id,
                    producto_id: res.producto_id,
                    movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
                    cantidad: proveedorProducto.cantidad!,
                    costo: proveedorProducto.costo!,
                    precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString(),
                    url_image: localStorage.getItem('almacenid')!
                  }
                  
                  console.log("ENTRO AL PRODUCTO EXISTEEEEEEEEEEEEEEEEEE")
                  this.httpServiceDetalle.agregarDetalleCompras(newDetalle2).pipe(finalize(() => {

                    this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle2).subscribe(res1 => {
                      if (res1.codigoError == 'OK') {
                        const newDetalleImp: DetalleImpuestosEntity = {
                          id: '',
                          detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                          cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
                          codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
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

                      this.botonBloqueado = false;

                      this.productoAgregado.emit(proveedorProducto);
                      this.cerrarDialog();

                    }
                  });
                }
              }
              );

            } else {

              console.log("Entro al error")

              if (proveedorProducto.cantidad! != '0' && proveedorProducto.productoExistente) {

                console.log("Entro al error")
                // //Solo modificamos el detalle que cambio la cantidad

                newDetalle.precio = (parseFloat(newDetalle.cantidad!) * parseFloat(newDetalle.costo!)).toString();


                this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
                  console.log(res.codigoError)
                  if (res.codigoError == 'OK') {

                    this.cerrarDialog();

                    this.productoAgregado.emit(proveedorProducto);

                  } else {

                  }
                });
              } else {
                this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
                  console.log("en este metodo" + res)

                  this.cerrarDialog();

                });
              }
            }
          }
        });


        // this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res1 => {
        //   if (res1.codigoError == 'NEXISTE') {
        //     console.log("ENTRO AL PRODUCTO NEXISTE")
        //     this.httpServiceInventario.agregarInventario(newInventario).pipe(
        //       finalize(() => {
        //         this.httpServiceInventario.obtenerInventariosExiste(newInventario).subscribe(res5 => {
        //           const newDetalle: DetallesMovimientoEntity = {
        //             id: '',
        //             producto_nombre: '',
        //             inventario_id: res5.lstInventarios[0].id,
        //             producto_id: res.producto_id,
        //             movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
        //             cantidad: proveedorProducto.cantidad!,
        //             costo: proveedorProducto.costo!,
        //             precio: (parseFloat(proveedorProducto.costo!) * parseFloat(proveedorProducto.cantidad!)).toString()
        //           }


        //           this.httpServiceDetalle.agregarDetalleCompra(newDetalle).pipe(finalize(() => {

        //             this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
        //               if (res1.codigoError == 'OK') {
        //                 const newDetalleImp: DetalleImpuestosEntity = {
        //                   id: '',
        //                   detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
        //                   cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
        //                   codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
        //                   porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
        //                   base_imponible: '',
        //                   valor: res1.lstDetalleMovimientos[0].costo!,
        //                   created_at: '',
        //                   updated_at: ''
        //                 }
        //                 this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
        //                   if (res2.codigoError != 'OK') {
        //                     Swal.fire({
        //                       icon: 'error',
        //                       title: 'Ha ocurrido un error.',
        //                       text: res2.descripcionError,
        //                       showConfirmButton: false
        //                     });
        //                   }
        //                 });
        //               }
        //             });
        //           })).subscribe(res4 => {
        //             if (res4.codigoError != 'OK') {
        //               Swal.fire({
        //                 icon: 'error',
        //                 title: 'Ha ocurrido un error.',
        //                 text: 'La cantidad no puede ser vacía',
        //                 showConfirmButton: false
        //               });
        //             } else {

        //               this.productoAgregado.emit(proveedorProducto);
        //               this.cerrarDialog();

        //             }
        //           });
        //         });
        //       })
        //     ).subscribe(res2 => {
        //       if (res2.codigoError != 'OK') {
        //         Swal.fire({
        //           icon: 'error',
        //           title: 'Ha ocurrido un error.',
        //           text: res2.descripcionError,
        //           showConfirmButton: false
        //         });
        //       } else {
        //       }
        //     });

        //   } else if (res1.codigoError == 'OK') {
        //     console.log("ENTRO AL OKKK")

        //     //Obtener el indice del producto
        //     console.log("ESTE es el inventario", res1.lstInventarios[0])

        //     const oper1 = parseFloat(res1.lstInventarios[0].costo!) * parseFloat(res1.lstInventarios[0].stock!);
        //     const oper2 = parseFloat(proveedorProducto.cantidad!) * parseFloat(proveedorProducto.costo!);
        //     const nuevoCosto = (oper1 + oper2) / (parseFloat(res1.lstInventarios[0].stock!) + parseFloat(proveedorProducto.cantidad!));
        //     const inventarioCosto: InventariosEntity = {
        //       categoria_id: '',
        //       categoria: '',
        //       linea: '',
        //       modelo: '',
        //       marca_id: '',
        //       marca: '',
        //       modelo_producto_id: '',
        //       idProducto: '',
        //       Producto: '',
        //       costo: nuevoCosto.toString(),
        //       id: res1.lstInventarios[0].id,
        //       dInventario: '',
        //       producto_id: '',
        //       almacen_id: '',
        //       almacen: '',
        //       stock_optimo: '',
        //       fav: '',
        //       color: ''
        //     }
        //     this.httpServiceInventario.actualizarCosto(inventarioCosto).subscribe(resC => {
        //       if (resC.codigoError != 'OK') {
        //         Swal.fire({
        //           icon: 'error',
        //           title: 'Ha ocurrido un error.',
        //           text: resC.descripcionError,
        //           showConfirmButton: false
        //         });
        //       } else {

        //       }
        //     });
        //     const newDetalle: DetallesMovimientoEntity = {
        //       id: '',
        //       producto_nombre: '',
        //       inventario_id: res1.lstInventarios[0].id,
        //       producto_id: res.producto_id,
        //       movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
        //       cantidad: proveedorProducto.cantidad!,
        //       costo: proveedorProducto.costo!,
        //       precio: (parseFloat(proveedorProducto.costo!) * parseInt(proveedorProducto.cantidad!)).toString()

        //     }


        //     if (!proveedorProducto.productoExistente) {
        //       if (proveedorProducto.cantidad == "0") {
        //         Swal.fire({
        //           icon: 'error',
        //           title: 'No se puede agregar 0',
        //           text: "La cantidad no puede ser 0",
        //           showConfirmButton: false
        //         });
        //         this.botonBloqueado = false
        //         return
        //       }
        //       this.httpServiceDetalle.agregarDetalleCompras(newDetalle).pipe(finalize(() => {

        //         this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {

        //           if (res1.codigoError == 'OK') {
        //             const newDetalleImp: DetalleImpuestosEntity = {
        //               id: '',
        //               detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
        //               cod_impuesto: res1.lstDetalleMovimientos[0].codigo_impuesto!,
        //               codigo_tarifa: res1.lstDetalleMovimientos[0].cod_tarifa!,
        //               porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
        //               base_imponible: '',
        //               valor: res1.lstDetalleMovimientos[0].costo!,
        //               created_at: '',
        //               updated_at: ''
        //             }
        //             this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {

        //               if (res2.codigoError != 'OK') {
        //                 Swal.fire({
        //                   icon: 'error',
        //                   title: 'Ha ocurrido un error.',
        //                   text: res2.descripcionError,
        //                   showConfirmButton: false
        //                 });
        //               }
        //             });
        //           }
        //         });
        //       })).subscribe(res3 => {
        //         if (res3.codigoError != 'OK') {
        //           Swal.fire({
        //             icon: 'error',
        //             title: 'Ha ocurrido un error.',
        //             text: 'La cantidad no puede ser vacía',
        //             showConfirmButton: false
        //           });
        //         } else {

        //           this.botonBloqueado = false;

        //           this.productoAgregado.emit(proveedorProducto);
        //           this.cerrarDialog();

        //         }
        //       });
        //     } else {
        //       if (proveedorProducto.cantidad! != '0' && proveedorProducto.productoExistente) {

        //         console.log("Entro al error")
        //         // //Solo modificamos el detalle que cambio la cantidad

        //         newDetalle.precio = (parseFloat(newDetalle.cantidad!) * parseFloat(newDetalle.costo!)).toString();


        //         this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
        //           console.log(res.codigoError)
        //           if (res.codigoError == 'OK') {

        //             this.cerrarDialog();

        //             this.productoAgregado.emit(proveedorProducto);

        //           } else {

        //           }
        //         });
        //       } else {
        //         this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
        //           console.log("en este metodo" + res)

        //           this.cerrarDialog();

        //         });
        //       }
        //     }
        //   }
        // });
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

