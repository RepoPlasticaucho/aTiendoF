import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject, take } from 'rxjs';
import {
  faShoppingBag,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { MarcasEntity } from 'src/app/models/marcas';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';
import { DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import { VerCarritoComponent } from '../ver-carrito/ver-carrito.component';

@Component({
  selector: 'app-menuvent',
  templateUrl: './menuvent.component.html',
  styleUrls: ['./menuvent.component.css'],
})
export class MenuventComponent implements OnInit {
  searchText: string = '';
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];

  costo: any;
  precio: any;
  //Variable contenedor id Modelo Producto
  codigo: string = '';

  constructor(
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router,
    private dialog: MatDialog
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

  verCarrito() {
    const dialogRef = this.dialog.open(VerCarritoComponent, {
      width: '700px',
      // Agrega cualquier configuración adicional del modal aquí
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
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
        this.httpServiceDetalle.agregarDetallePedido(newDetalle).subscribe(res => {
          if (res.codigoError != 'OK') {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: 'No se ha obtenido información.',
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
