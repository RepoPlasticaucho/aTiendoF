import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingBag, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
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
                  const columnIds: { id: string, url: string }[] = [];
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
                        console.log("Algunas tamaños no existen en algunos colores");
                      } else {
                        if (res4.lstProductos.length > 0) {
                          const id = res4.lstProductos[0].id;
                          const url = res4.lstProductos[0].url_image; // Reemplaza "otraVariable" con el nombre real de la propiedad que deseas guardar
                          columnIds.push({ id, url });
                          missingIds[result.columnIndex] = false;
                        } else {
                          columnIds.push({ id: "", url: "" });
                        }
                      }
                    });

                    missingIds.forEach((missing, index) => {
                      if (missing) {
                        columnIds.splice(index, 0, { id: "", url: "" });
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

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
    this.realizarCalculo();
  }

  realizarCalculo() {
    this.resultado = 0;

    this.lstProductos.forEach((fila, filaIndex) => {
      this.lstModeloProductos.forEach((columna, columnIndex) => {
        const inputElement = document.getElementById(`input-${filaIndex}-${columnIndex}`) as HTMLInputElement;

        if (inputElement && inputElement.value) {
          const inputValue = Number(inputElement.value);
          const id = this.matrizIds[filaIndex]?.[columnIndex];

          if (id && inputValue) {
            this.resultado += inputValue * Number(id.id);
          }
        }
      });
    });
  }

  cambiarImagen(url: string) {
    this.imagenSeleccionada = url;
  }
}
