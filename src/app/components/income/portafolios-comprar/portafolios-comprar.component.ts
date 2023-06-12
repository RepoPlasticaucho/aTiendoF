import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingBag, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
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
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstProductos: ProducAdmEntity[] = [];
  imagen: string = '';
  producto: string = '';
  desc: string = '';
  id: string = '';
  resultado: number = 0;
  matrizIds: any[][] = [];
  imagenSeleccionada: string = '';
  lastEditedCell: { row: number, column: number } | null = null;
  detalleProductos: { idProducto: any, cantidad: number, pvp: any, precio: number }[] = [];


  constructor(private readonly httpService: ModeloproductosService,
    private readonly httpServiceProductos: ProductosAdminService,
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
        const subtotal = inputValue * Number(id.pvp);
        this.resultado = Number(subtotal.toFixed(2));
      }
    }
  }

  cambiarImagen(url: string) {
    this.imagenSeleccionada = url;
    this.resultado = 0;
  }

  obtenerDetalleProductos() {
    this.detalleProductos = [];
    this.matrizIds.forEach((fila, i) => {
      fila.forEach((columna, j) => {
        const inputElement = document.getElementById(`input-${i}-${j}`) as HTMLInputElement;
        if (columna && columna.id && inputElement && inputElement.value) {
          const idProducto: string = columna.id;
          const cantidad = Number(inputElement.value);
          const pvp: any = columna.pvp;
          const precio: any = Number((cantidad * pvp).toFixed(2));
          /*
          const newDetalle: DetalleMovimiento {
            id: '',
            producto_id: idProducto,
            movimiento_id: '',
            cantidad: cantidad,
            costo: pvp,
            precio: precio
          }
          this.httpService.agregarDetalleMovimiento(newDetalle).subscribe(res => {
            if (res.id == '') {
              Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: 'No se ha obtenido información.',
              showConfirmButton: false
              });
            } else {
              Swal.fire({
                  icon: 'success',
                  title: 'Guardado Exitosamente.',
                  text: `Se ha guardado con éxito`,
                  showConfirmButton: true,
                  confirmButtonText: 'Ok',
                }).finally(() => {
                  this.router.navigate([
                    '/navegation-cl',
                    { outlets: { contentClient: ['portafolios'] } },
                  ]);
                });
            }
          });
          */
          this.detalleProductos.push({ idProducto, cantidad, pvp, precio });
        }
      });
    });
    console.log(this.detalleProductos);
    // Aquí puedes realizar las operaciones o enviar los datos al servidor
  }
}
