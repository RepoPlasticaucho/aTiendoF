import { Component, OnInit, EventEmitter } from '@angular/core';
import { faShoppingBag, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuventComponent } from '../menuvent/menuvent.component';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { Subject, take } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';
import { DetalleImpuestosEntity } from 'src/app/models/detalle-impuestos';
import { finalize } from 'rxjs';
import { DetalleImpuestosService } from 'src/app/services/detalle-impuestos.service';

@Component({
  selector: 'app-ver-carrito',
  templateUrl: './ver-carrito.component.html',
  styleUrls: ['./ver-carrito.component.css']
})
export class VerCarritoComponent implements OnInit {

searchText: string = '';
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  faTimes = faTimes;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];

  costo: any;
  precio: any;
  //Variable contenedor id Modelo Producto
  codigo: string = '';
  productoAgregado: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router,
    private readonly httpServiceDetalleImp: DetalleImpuestosService,
    private dialogRef: MatDialogRef<MenuventComponent>
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
        this.httpServiceInventarios.obtenerPortafolios(almacenNew).subscribe((res1) => {
          console.log(res1)
          if (res1.codigoError != 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo obtener los productos.',
              text: res1.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstInventarios = res1.lstInventarios;
            this.dtTrigger.next('');
            for(let i = 0; i < this.lstInventarios.length; i++){
              const newDetalle: DetallesMovimientoEntity = {
                id: '',
                producto_id: this.lstInventarios[i].producto_id,
                producto_nombre: '',
                inventario_id: '',
                movimiento_id: localStorage.getItem('movimiento_id')!,
                cantidad: '',
                costo: '',
                precio: ''
              }
              console.log(newDetalle)
              this.httpServiceDetalle.obtenerDetalleMovimientoEx(newDetalle).subscribe(res2 => {
                if (res2.codigoError == 'OK'){
                  this.lstInventarios[i].productoExistente = true; // El producto ya existe en detalle_movimientos
                  this.lstInventarios[i].cantidad = res2.lstDetalleMovimientos[0].cantidad;
                } else {
                  this.lstInventarios[i].productoExistente = false; // El producto no existe en detalle_movimientos
                }
              });
            }
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

  parseInt(value: string): number {
    return parseInt(value, 10);
  }


  crearDetalle(inventario: InventariosEntity): void {
    this.httpServiceInventarios.asignarInventario(inventario);
    this.httpServiceInventarios.obtenerInventario$.pipe(take(1)).subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        }).finally(() => {
          this.router.navigate([
            '/navegation-cl',
            { outlets: { contentClient: ['menuvent'] } },
          ]);
        });
      } else {
        //Asignamos los valores a los campos
        this.costo = res.pvp2;
        this.precio = parseFloat(res.pvp2!) * parseFloat(inventario.cantidad!);
        this.codigo = res.id!;
        console.log(inventario.productoExistente)
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
          }
          if(inventario.cantidad! != '0'){
            this.httpServiceDetalle.modificarDetallePedidoVenta(newDetalle).subscribe(res => {
              console.log(res.codigoError)
              if(res.codigoError == 'OK'){
                console.log("Actualizado")
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
              console.log(res)
              if(res.codigoError == 'OK'){
                console.log("Eliminado")
              }
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
          }
          this.httpServiceDetalle.agregarDetallePedido(newDetalle).pipe(finalize(() => {
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
          })
          ).subscribe(res => {
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
              this.productoAgregado.emit(inventario);
            }
          });
        }
      }
    })
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }
  

}


