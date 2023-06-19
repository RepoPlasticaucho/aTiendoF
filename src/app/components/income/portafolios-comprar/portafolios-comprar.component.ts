import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingBag, faMoneyBillAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import { DetallesMovimiento, DetallesMovimientoEntity } from 'src/app/models/detallesmovimiento';
import { DetallesmovimientoService } from 'src/app/services/detallesmovimiento.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-portafolios-comprar',
  templateUrl: './portafolios-comprar.component.html',
  styleUrls: ['./portafolios-comprar.component.css']
})
export class PortafoliosComprarComponent implements OnInit {
  faShoppingBag = faShoppingBag;
  faMoneyBillAlt = faMoneyBillAlt;
  faShoppingCart = faShoppingCart;
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstProductos: ProducAdmEntity[] = [];
  imagen: string = '';
  producto: string = '';
  desc: string = '';
  id: string = '';
  resultado: any;
  matrizIds: any[][] = [];
  imagenSeleccionada: string = '';
  lastEditedCell: { row: number, column: number } | null = null;
  detalleProductos: { idProducto: any, cantidad: number, pvp: any, precio: number }[] = [];
  detalleGuardado: boolean = false;

  constructor(private readonly httpService: ModeloproductosService,
    private readonly httpServiceProductos: ProductosAdminService,
    private readonly httpServiceDetalle: DetallesmovimientoService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpService.obtenermodeloproducto$.subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false
        });
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
      } else {
        const modeloProducto: ModeloProductosEntity = {
          id: res.id,
          marca: '',
          url_image: '',
          etiquetas: '',
          marca_id: '',
          modelo_id: '',
          color_id: '',
          atributo_id: '',
          genero_id: '',
          modelo_producto: '',
          cod_sap: '',
          cod_familia: res.cod_familia
        }
        this.imagen = res.url_image;
        this.producto = res.modelo_producto;
        this.desc = res.atributo!;
        this.httpService.obtenerModeloProductosColor(modeloProducto).subscribe(res1 => {
          if (res1.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res1.descripcionError,
              showConfirmButton: false,
              // timer: 3000
            });
          } else {
            this.lstModeloProductos = res1.lstModelo_Productos;
            this.httpServiceProductos.obtenerProductosTamanio(modeloProducto).subscribe(res2 => {
              if (res2.codigoError != "OK") {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res2.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                });
              } else {
                this.lstProductos = res2.lstProductos;
                this.lstProductos.forEach((fila, filaIndex) => {
                  const columnIds: { id: string, url: string, pvp: string }[] = [];
                  const observables = this.lstModeloProductos.map((columna, columnIndex) => {
                    return this.httpServiceProductos.obtenerProductosID(fila.tamanio, columna.color!, res.cod_familia!)
                      .pipe(
                        map((res4) => ({
                          res4,
                          columnIndex
                        }))
                      );
                  });

                  forkJoin(observables).subscribe((results: { res4: any, columnIndex: number }[]) => {
                    results.sort((a, b) => a.columnIndex - b.columnIndex);

                    const missingIds: boolean[] = Array(this.lstModeloProductos.length).fill(true);

                    results.forEach((result) => {
                      const res4 = result.res4;
                      if (res4.codigoError != "OK") {
                        console.log("Algunos tamaños no existen en algunos colores");
                      } else {
                        if (res4.lstProductos.length > 0) {
                          const id = res4.lstProductos[0].id;
                          const url = res4.lstProductos[0].url_image;
                          const pvp = res4.lstProductos[0].pvp;
                          columnIds.push({ id, url, pvp });
                          missingIds[result.columnIndex] = false;
                        } else {
                          columnIds.push({ id: "", url: "", pvp: "" });
                        }
                      }
                    });

                    missingIds.forEach((missing, index) => {
                      if (missing) {
                        columnIds.splice(index, 0, { id: "", url: "", pvp: "" });
                      }
                    });
                    this.matrizIds[filaIndex] = columnIds;
                  });
                });

              }
            });
          }
        });
      }
    });
  }

  verPortafolios(event: Event) {
    event.preventDefault();
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }

  isCellEmpty(i: number, j: number): boolean {
    return !this.matrizIds[i] || !this.matrizIds[i][j] || !this.matrizIds[i][j].id;
  }

  onInput(event: any, i: number, j: number) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
    this.lastEditedCell = { row: i, column: j };
    this.realizarCalculo();
  }

  realizarCalculo() {
    this.resultado = 0;

    if (this.lastEditedCell) {
      const { row, column } = this.lastEditedCell;
      const id = this.matrizIds[row]?.[column];
      const inputElement = document.getElementById(`input-${row}-${column}`) as HTMLInputElement;

      if (id && inputElement && inputElement.value) {
        const inputValue = Number(inputElement.value);
        const pvpValue = parseFloat(id.pvp.replace(',', '.'));
        const subtotal = inputValue * pvpValue;
        this.resultado = subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 });;
      }
    }
  }

  cambiarImagen(url: string) {
    this.imagenSeleccionada = url;
    this.resultado = 0;
  }

  obtenerDetalleProductos() {
    this.detalleProductos = [];
    Swal.fire({
      title: '¿Quieres guardar los productos?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Añadir',
      denyButtonText: `No añadir`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.matrizIds.forEach((fila, i) => {
          fila.forEach((columna, j) => {
            const inputElement = document.getElementById(`input-${i}-${j}`) as HTMLInputElement;
            if (columna && columna.id && inputElement && inputElement.value) {
              const idProducto: string = columna.id;
              const cantidad = Number(inputElement.value);
              const pvp: any = parseFloat(columna.pvp.replace(',', '.'));
              const pre: any = cantidad * pvp;
              const precio: any = pre;
              const cant: string = cantidad.toString();

              const newDetalle: DetallesMovimientoEntity = {
                id: '',
                producto_nombre: '',
                inventario_id: '',
                producto_id: idProducto,
                movimiento_id: JSON.parse(localStorage.getItem('movimiento_id') || "[]"),
                cantidad: cant,
                costo: pvp,
                precio: precio
              }
              this.httpServiceDetalle.agregarDetallePedido(newDetalle).subscribe(res => {
                if (res.codigoError != 'OK') {
                  Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: 'No se ha obtenido información.',
                  showConfirmButton: false
                  });
                }
              });        
              this.detalleProductos.push({ idProducto, cantidad, pvp, precio });
            }
          });
        });
        Swal.fire({
          icon: 'success',
          title: 'Guardado Exitosamente.',
          text: `Se ha guardado con éxito`,
          showConfirmButton: true,
          confirmButtonText: 'Ok',
        });
        this.detalleGuardado = true;       
      } else if (result.isDenied) {
        Swal.fire('No se guardaron los productos', '', 'info')
      }
    }); 
    console.log(this.detalleProductos);
    // Aquí puedes realizar las operaciones o enviar los datos al servidor
  }

  isCellEntered(i: number, j: number): boolean {
    const id = this.matrizIds[i]?.[j]?.id;
    return this.detalleProductos.some((detalle) => detalle.idProducto === id);
  }

  limpiarMatriz() {
    this.matrizIds.forEach((fila, i) => {
      fila.forEach((columna, j) => {
        const inputElement = document.getElementById(`input-${i}-${j}`) as HTMLInputElement;
        if (inputElement) {
          inputElement.value = ''; // Establecer el valor en blanco
          this.resultado = 0;
        }
      });
    });
  }
  verCarrito() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['carrito'] } }]);
  }
}
