import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { faShoppingBag, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Subject, forkJoin, take } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { DetalleImpuestosEntity } from 'src/app/models/detalle-impuestos';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ver-carrito',
  templateUrl: './ver-carrito.component.html',
  styleUrls: ['./ver-carrito.component.css']
})
export class VerCarritoComponent implements OnInit {

  @Output() prAgregado = new EventEmitter<any>();

  searchText: string = '';
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];

  costo: any;
  precio: any;
  codigo: string = '';
  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router,
    private readonly httpServiceDetalleImp: DetalleImpuestosService
  ) { }

  ngOnInit(): void {
    let cantidadAux = "";
    let inventario: InventariosEntity = {
      categoria_id: '',
      categoria: '',
      linea_id: '',
      linea: '',
      modelo_id: '',
      modelo: '',
      marca_id: '',
      marca: '',
      modelo_producto_id: '',
      modelo_producto: '',
      idProducto: '',
      Producto: '',
      productoExistente: false,
      id: '',
      dInventario: '',
      producto_id: '',
      tarifa_ice_iva: '',
      tarifa_ice_iva_id: '',
      almacen_id: '',
      producto_nombre: '',
      almacen: '',
      stock: '',
      etiquetas: '',
      stock_optimo: '',
      fav: '',
      color: '',
      costo: '',
      cantidad: '',
      pvp1: '',
      pvp2: '',
      pvp_sugerido: '',
      cod_principal: '',
      cod_secundario: '',
      unidad_medidad: '',
      url_image: '',
      talla: '',
      tarifa_ice_iva1: '',
      tarifa_ice_iva_id1: '',
      genero: '',
      atributo: ''
    };

    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: false,
      search: false,
      searching: true,
      ordering: true,
      info: false,
      pageLength: 3,
      scrollY: '50vh',      

      
      responsive: {
        details: {
          renderer: (api: any, rowIdx: any, columns: any) => {
            var data = $.map(columns, function (col, i) {
              return col.hidden ?
                `<tr data-dt-row="${col.rowIndex}" data-dt-column="${col.columnIndex}">
                  <td>${col.title}:</td>
                  <td>${col.data}</td>
                </tr>` : '';
            }).join('');

            inventario = this.lstInventarios[rowIdx];
            return data ? $('<table/>').append(data) : false;
          }
        }
      },
      initComplete: () => {
        $('#dataTable tbody').on('input', 'input', function () {
          cantidadAux = $(this).val() + "";
        });

        $('#dataTable tbody').on('click', 'tr button', () => {
          const cantidad = document.getElementById("cantidad") as HTMLInputElement;
          if (cantidadAux === "0") return;
          inventario.cantidad = cantidadAux;
          this.crearDetalle(inventario);
        });
      }
    };

    this.loadInventarios();
  }

  loadInventarios(): void {
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        const almacenNew: AlmacenesEntity = {
          idAlmacen: localStorage.getItem('almacenid')!,
          sociedad_id: '',
          nombresociedad: '',
          direccion: '',
          telefono: '',
          codigo: '',
          pto_emision: '',
        };
        this.httpServiceInventarios.obtenerPortafolios(almacenNew).subscribe(res1 => {
          if (res1.codigoError !== 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener los productos.',
              text: res1.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstInventarios = res1.lstInventarios;
            this.dtTrigger.next('');
            const batchSize = 10;
            const totalProducts = this.lstInventarios.length;

            const processBatch = (startIndex: number) => {
              const endIndex = Math.min(startIndex + batchSize, totalProducts);
              const batchObservables = [];

              for (let i = startIndex; i < endIndex; i++) {
                const inventario = this.lstInventarios[i];
                const newDetalle: DetallesMovimientoEntity = {
                  id: '',
                  producto_id: inventario.producto_id,
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
                  if (res2.codigoError === 'OK') {
                    this.lstInventarios[startIndex + i].productoExistente = true;
                    this.lstInventarios[startIndex + i].cantidad = res2.lstDetalleMovimientos[0].cantidad;
                  } else {
                    this.lstInventarios[startIndex + i].productoExistente = false;
                  }
                });

                if (endIndex < totalProducts) {
                  processBatch(endIndex);
                } else {
                  Swal.close();
                }
              });
            };

            processBatch(0);
          }
        });
      },
    }).then(result => {
      if (result.dismiss === Swal.DismissReason.timer) {
        console.log('I was closed by the timer');
      }
    });
  }



  facturar1(): void {
    const nuevaLista = this.lstInventarios.filter(invent => invent.cantidad !== undefined && invent.cantidad !== '' && invent.cantidad !== '0');
    //Crear el detalle de cada uno de la nueva lista
    nuevaLista.forEach(invent => {
      this.crearDetalle(invent)
    })
    //window.location.reload();
   
}

facturar(): void {
  const nuevaLista = this.lstInventarios.filter(invent => invent.cantidad !== undefined && invent.cantidad !== '' && invent.cantidad !== '0');
  const promesas = nuevaLista.map(invent => this.crearDetalle(invent));
  
 // Promise.all(promesas).then(() => {
   // window.location.reload();

   //Emitir evento prAgregado
    this.prAgregado.emit(nuevaLista);
  // }).catch(error => {
  //   console.error("Error al procesar la lista: ", error);
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error',
  //     text: 'Ocurrió un error al procesar la lista.',
  //     showConfirmButton: true
  //   });
  // });
}


crearDetalle(inventario: InventariosEntity): Promise<void> {
  return new Promise((resolve, reject) => {
    this.httpServiceInventarios.asignarInventario(inventario);
    console.log("Aca 1");
    this.httpServiceInventarios.obtenerInventario$.pipe(take(1)).subscribe(res => {
      console.log("Aca 2");
      if (res.id === '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        }).finally(() => {
          this.router.navigate(['/navegation-cl', { outlets: { contentClient: ['menuvent'] } }]);
          resolve(); // Resuelve la promesa incluso si hay error
        });
      } else {
        this.costo = res.pvp2;
        this.precio = parseFloat(res.pvp2!) * parseFloat(inventario.cantidad!);
        this.codigo = res.id!;

        if (inventario.productoExistente) {
          const newDetalle: DetallesMovimientoEntity = {
            id: '',
            producto_nombre: '',
            inventario_id: this.codigo,
            producto_id: res.producto_id,
            movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
            cantidad: inventario.cantidad!,
            costo: '',
            precio: ''
          };

          newDetalle.precio = (parseFloat(inventario.cantidad!) * parseFloat(res.pvp2!)).toString();

          if (inventario.cantidad! !== '0') {
            this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
              if (res.codigoError === 'OK') {
                resolve(); // Resuelve la promesa cuando se completa la operación
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: 'No existe suficiente stock.',
                  showConfirmButton: false
                }).finally(() => resolve());
              }
            }, error => reject(error));
          } else {
            this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: `Se ha eliminado el producto del detalle`,
                showConfirmButton: true,
                confirmButtonText: 'Ok',
              }).then(() => {
                this.cerrar();
                resolve();
              });
            }, error => reject(error));
          }
        } else {
          const newDetalle: DetallesMovimientoEntity = {
            id: '',
            producto_nombre: '',
            inventario_id: this.codigo,
            producto_id: res.producto_id,
            movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
            cantidad: inventario.cantidad!,
            costo: this.costo,
            precio: this.precio
          };

          console.log("Aca el detalle" + JSON.stringify(newDetalle));

          this.httpServiceDetalle.agregarDetallePedido(newDetalle).pipe(finalize(() => {
            this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
              if (res1.codigoError === 'OK') {
                const newDetalleImp: DetalleImpuestosEntity = {
                  id: '',
                  detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                  cod_impuesto: res1.lstDetalleMovimientos[0].cod_tarifa!,
                  porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
                  base_imponible: '',
                  valor: res1.lstDetalleMovimientos[0].costo!,
                  created_at: '',
                  updated_at: ''
                };
                this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
                  if (res2.codigoError !== 'OK') {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ha ocurrido un error.',
                      text: res2.descripcionError,
                      showConfirmButton: false
                    });
                    resolve(); // Resuelve la promesa incluso si hay error
                  } else {
                    resolve();
                  }
                }, error => reject(error));
              } else {
                resolve();
              }
            }, error => reject(error));
          })).subscribe(res => {
            if (res.codigoError !== 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error3.',
                text: 'No existe suficiente stock.',
                showConfirmButton: false
              }).finally(() => resolve());
            } else {
              this.productoAgregado.emit(inventario);
              resolve();
            }
          }, error => reject(error));
        }
      }
    });
  });
}

  crearDetalle1(inventario: InventariosEntity): void {

    this.httpServiceInventarios.asignarInventario(inventario);
    console.log("Aca 1");
    this.httpServiceInventarios.obtenerInventario$.pipe(take(1)).subscribe(res => {
      console.log("Aca 2");
      if (res.id === '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        }).finally(() => {
          this.router.navigate(['/navegation-cl', { outlets: { contentClient: ['menuvent'] } }]);
        });
      } else {
        this.costo = res.pvp2;
        this.precio = parseFloat(res.pvp2!) * parseFloat(inventario.cantidad!);
        this.codigo = res.id!;

        if (inventario.productoExistente) {
          const newDetalle: DetallesMovimientoEntity = {
            id: '',
            producto_nombre: '',
            inventario_id: this.codigo,
            producto_id: res.producto_id,
            movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
            cantidad: inventario.cantidad!,
            costo: '',
            precio: ''
          };

          newDetalle.precio = (parseFloat(inventario.cantidad!) * parseFloat(res.pvp2!)).toString();

          if (inventario.cantidad! !== '0') {
            this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
              if (res.codigoError === 'OK') {
            
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: 'No existe suficiente stock.',
                  showConfirmButton: false
                });
              }
            });
          } else {
            this.httpServiceDetalle.eliminarDetallePedidoVenta(newDetalle).subscribe(res => {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: `Se ha eliminado el producto del detalle`,
                showConfirmButton: true,
                confirmButtonText: 'Ok',
              }).then(() => {
                this.cerrar();
              });
            });
          }
        } else {
          const newDetalle: DetallesMovimientoEntity = {
            id: '',
            producto_nombre: '',
            inventario_id: this.codigo,
            producto_id: res.producto_id,
            movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
            cantidad: inventario.cantidad!,
            costo: this.costo,
            precio: this.precio
          };

          console.log("Aca el detalle" + JSON.stringify(newDetalle));

          this.httpServiceDetalle.agregarDetallePedido(newDetalle).pipe(finalize(() => {
            this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
              if (res1.codigoError === 'OK') {
                const newDetalleImp: DetalleImpuestosEntity = {
                  id: '',
                  detalle_movimiento_id: res1.lstDetalleMovimientos[0].id,
                  cod_impuesto: res1.lstDetalleMovimientos[0].cod_tarifa!,
                  porcentaje: res1.lstDetalleMovimientos[0].tarifa!,
                  base_imponible: '',
                  valor: res1.lstDetalleMovimientos[0].costo!,
                  created_at: '',
                  updated_at: ''
                };
                this.httpServiceDetalleImp.agregarDetalleImpuestos(newDetalleImp).subscribe(res2 => {
                  if (res2.codigoError !== 'OK') {
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
          })).subscribe(res => {
            if (res.codigoError !== 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error3.',
                text: 'No existe suficiente stock.',
                showConfirmButton: false
              });
            } else {
     
              this.productoAgregado.emit(inventario);
            }
          });
        }
      }
    });
  }

  cerrar(): void {
    // Simulación del cierre de un dialog sin depender de MatDialog
    this.router.navigate(['/navegation-cl', { outlets: { contentClient: ['menuvent'] } }]);
  }

  parseInt(value: string): number {
    return parseInt(value, 10);
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }

  //Cada vez que de enter en la cantidad se llama facturar
  onEnter(event: any) {
    if (event.keyCode === 13) {
      this.facturar();
    }
  }

}
