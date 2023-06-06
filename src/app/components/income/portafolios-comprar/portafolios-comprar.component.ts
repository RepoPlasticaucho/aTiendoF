import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'app-portafolios-comprar',
  templateUrl: './portafolios-comprar.component.html',
  styleUrls: ['./portafolios-comprar.component.css']
})
export class PortafoliosComprarComponent implements OnInit {
  faShoppingBag = faShoppingBag;
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstProductos: ProducAdmEntity[] = [];
  imagen: string = '';
  producto : string = '';
  desc : string = '';
  id: string = '';
  matrizIds: string[][] = [];


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
                this.lstProductos.forEach((fila) => {
                const columnIds: string[] = [];
                this.lstModeloProductos.forEach((columna) => {
                  this.isCeldaEditable(columna.color_id, fila.tamanio, columna.cod_familia); // se verifica si es editable
                  this.httpServiceProductos.obtenerProductosID(fila.tamanio, columna.color!, res.cod_familia!).subscribe(res4 => {
                    console.log(fila.tamanio)
                    console.log(res4.lstProductos[0].id)
                    if (res4.codigoError != "OK") {
                    } else {
                      columnIds.push(res4.lstProductos[0].id);
                    }
                  });
                });
                this.matrizIds.push(columnIds);
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

  isCeldaEditable(columna: any, fila: any, cod_fam: any): Observable<boolean> {
    // Retorna true si la celda es editable, false en caso contrario
    // Verificar si el id del producto tiene ese id del color
    return this.httpServiceProductos.verificarProductosMP(columna,fila,cod_fam).pipe(map(res3 => {
      if (res3.codigoError != "OK") {
        return false;
      } else {
        return true;
      }
    })
    )
  }

  onInput(event: any) {
    const inputValue = event.target.value;
    event.target.value = inputValue.replace(/[^0-9]/g, ''); // Filtra solo números
  }
}
