
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
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
import { MenuventComponent } from '../menuvent/menuvent.component';
import { x64 } from 'crypto-js';

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
  lstDetalles: DetallesMovimientoEntity[] = [];

  costo: any;
  precio: any;
  codigo: string = '';
  auxlst: InventariosEntity[] = [];
  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router,
    private readonly httpServiceDetalleImp: DetalleImpuestosService,
    private menuvent: MenuventComponent
  ) { }

  ngOnInit(): void {
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    //Suscribirse a los cambios de la lista de inventarios de menuvent
    this.menuvent.emiteDesdeProductoAgregado.subscribe((evento: { objeto: any, mensaje: string, valor?: any }) => {

      let detalleMovimiento = evento.objeto;

      console.log("Detalle Movimiento", detalleMovimiento);

      let mensaje = evento.mensaje;
      let valor = evento.valor;


      //Agregar un nuevo producto
      if(mensaje === "agregar"){
        //Actualizar la lista de detalles
        console.log("Entra al agregar");
        this.lstDetalles = evento.objeto;
        console.log("Lista de detalles desde vercarrito", this.lstDetalles);
      }


      if(mensaje === "eliminar"){
        console.log("Entra al eliminar");
      this.lstInventarios.forEach(inventario => {
        if (inventario.producto_id === detalleMovimiento.producto_id) {
          inventario.stock_auxiliar = (parseInt(inventario.stock_auxiliar!) + parseInt(detalleMovimiento.cantidad!)).toString();
          //Vaciar el campo de cantidad
          inventario.cantidad = '';
          inventario.productoExistente = false;
        }
      })

   

      
      //Actualizar auxlst
      this.auxlst = this.auxlst.filter(inventario => inventario.producto_id !== detalleMovimiento.producto_id);
      console.log("Lista de inventarios", this.lstInventarios)
      ;
      }


         //Si el mensaje es edita actualizar la cantidad del producto en el input
         if(mensaje === "editar"){

          

          console.log("Entra al editar del mensaje");
          this.lstInventarios.forEach(inventario => {
            if (inventario.producto_id === detalleMovimiento.producto_id) {
              inventario.cantidad = detalleMovimiento.cantidad;
            
              //Actualizar el stock auxiliar
              inventario.stock_auxiliar = (parseInt(inventario.stock!) - parseInt(detalleMovimiento.cantidad!)).toString();

              //Actualizar auxlst
              const detalleExistente = this.auxlst.find(detalle => detalle.producto_id === detalleMovimiento.producto_id);
              if (detalleExistente) {
                detalleExistente.cantidad = detalleMovimiento.cantidad;
              }
            }
          });
        }



      // if(mensaje === "editar"){
      //   this.lstInventarios.forEach(inventario => {
      //     if (inventario.producto_id === detalleMovimiento.producto_id) {
      //       //Modificar el stock auxiliar si el nuevo valor es mayor al anterior
      //       if(valor > inventario.stock!){
      //         return
      //       }

      //       //inventario.stock_auxiliar = (parseInt(inventario.stock!) + parseInt(inventario.cantidad!) - valor).toString();

      //       //Si el valor es mayor que el inventario.calidad y menor que el stock se resta
      //       if(valor > parseInt(inventario.cantidad!) && valor < parseInt(inventario.stock!)){
      //         inventario.stock_auxiliar = (parseInt(inventario.stock!) - (valor - parseInt(inventario.cantidad!))).toString();
      //       }

      //       //Si el valor es menor que el inventario.calidad y menor que el stock se suma
      //       if(valor < parseInt(inventario.cantidad!) && valor < parseInt(inventario.stock!)){
      //         inventario.stock_auxiliar = (parseInt(inventario.stock!) + (parseInt(inventario.cantidad!) - valor)).toString();
      //       }




      //       inventario.cantidad = valor.toString();

      //       console.log("Valor Input", valor);
      //     }
      //   });
      //   }
    });



    
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
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: false,
      pageLength: 15,
      scrollY: '50vh',
      //Mostrar cargando mientras se renderiza la tabla
      deferRender: true,

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
        Swal.close();
        
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

            //Asginar el stock auxiliar
            this.lstInventarios.forEach(inventario => {
              inventario.stock_auxiliar = inventario.stock;
            });

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

    
    // Filtra los nuevos detalles que tienen una cantidad definida y mayor a cero
    const nuevos = this.lstInventarios.filter(invent =>
      invent.cantidad !== undefined && invent.cantidad !== ''
    );


    //Si el producto_id ya existe en auxlst y tiene la misma cantidad, no se agrega
    this.lstDetalles.forEach(detalle => {
      const detalleExistente = this.auxlst.find(det => det.producto_id === detalle.producto_id);
      if (detalleExistente) {
        if (detalleExistente.cantidad === detalle.cantidad) {
          nuevos.splice(nuevos.findIndex(nuevo => nuevo.producto_id === detalle.producto_id), 1);
        }
      }
    });


    //Si la cantidad es mayor a la del stock
    const inventariosConStockInsuficiente = nuevos.filter(inventario => parseInt(inventario.cantidad!) > parseInt(inventario.stock!));
    if (inventariosConStockInsuficiente.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'No existe suficiente stock.',
        showConfirmButton: false,
      });
      return;
    }

    nuevos.forEach(nuevo => {

      //Comparar con lstInventarios 

      // Busca si el detalle ya existe en auxlst
      const detalleExistente = this.auxlst.find(detalle => detalle.producto_id === nuevo.producto_id);

      if (detalleExistente) {
        // Si el detalle ya existe, actualiza la cantidad
        detalleExistente.cantidad! == nuevo.cantidad;  // Asumiendo que cantidad es un número
       

        detalleExistente.productoExistente = true;
        this.crearDetalle(detalleExistente).then(() => {
          console.log("Entra al if de detalle existente");
          this.prAgregado.emit([detalleExistente]);

          //Actualizar el stock de la lista de inventarios
          this.lstInventarios.forEach(inventario => {
            if (inventario.producto_id === detalleExistente.producto_id) {
              const val = parseInt(inventario.stock!) - parseInt(detalleExistente.cantidad!);
              inventario.stock_auxiliar = val.toString();
            }
          }
          )
        }).catch(error => {
          console.error("Error al crear detalle existente", error);
        });




      } else {
        // Si no existe, agrega el nuevo detalle a la lista y lo crea
        this.auxlst.push(nuevo);
        this.crearDetalle(nuevo).then(() => {
          console.log("Entra al else de detalle nuevo");
          // Emitir el nuevo detalle agregado
          this.prAgregado.emit([nuevo]);
           //Actualizar el stock de la lista de inventarios

           this.lstInventarios.forEach(inventario => {
            if (inventario.producto_id === nuevo.producto_id) {
              const val = parseInt(inventario.stock!) - parseInt(nuevo.cantidad!);
              inventario.stock_auxiliar = val.toString();
            }
          }
          );




        });
       
   
      }
    });

    console.log("Detalles finales:", this.auxlst);
  }



  crearDetalle(inventario: InventariosEntity): Promise<void> {

      //Cambiar la , por el .
    inventario.pvp1 = inventario.pvp1?.replace(',', '.');
    inventario.pvp2 = inventario.pvp2?.replace(',', '.');
    inventario.costo = inventario.costo?.replace(',', '.');

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
              
                  inventario.productoExistente = false;
                  //Actualizar auxlst con el nuevo inventario
                  this.auxlst = this.auxlst.filter(invent => invent.producto_id !== inventario.producto_id);                  
       

                  this.cerrar();
                  resolve();
             

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
              precio: this.precio,
            };
            
            if (newDetalle.cantidad === '0') {
              resolve();
              return;
            }

            console.log("Aca el detalle" + JSON.stringify(newDetalle));

            this.httpServiceDetalle.agregarDetallePedido(newDetalle).pipe(finalize(() => {
              this.httpServiceDetalle.obtenerUltDetalleMovimiento(newDetalle).subscribe(res1 => {
                if (res1.codigoError === 'OK') {
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
                  };

                  console.log("Aca el detalleImp" + JSON.stringify(newDetalleImp));


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
                  text: 'No existe suficiente stock.2',
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
