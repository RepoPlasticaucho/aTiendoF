import { Component, OnInit } from '@angular/core';

import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { MarcasService } from 'src/app/services/marcas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { MarcasEntity } from 'src/app/models/marcas';

@Component({
  selector: 'app-portafolios',
  templateUrl: './portafolios.component.html',
  styleUrls: ['./portafolios.component.css']
})
export class PortafoliosComponent implements OnInit {
  searchText: string = '';
  lstModeloProductos: ModeloProductosEntity[] = [];
  faShoppingBag = faShoppingBag;

  constructor(private readonly httpServiceModeloproductos: ModeloproductosService,
    private readonly httpServiceMarcas: MarcasService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpServiceMarcas.obtenermarca$.subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false
        });
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['vistamarcas'] } }]);
      } else {
        Swal.fire({
          title: 'CARGANDO...',
          html: 'Se están cargando los productos.',
          timer: 30000,
          didOpen: () => {
            Swal.showLoading();
            const marcasNew: MarcasEntity = {
              id: '',
              marca: res.marca,
              url_image:'',
              etiquetas:''
            }
            this.httpServiceModeloproductos.obtenerModeloProductosMarca(marcasNew).subscribe((res1) => {
              if (res1.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo obtener Marcas.',
                  text: res1.descripcionError,
                  showConfirmButton: false,
                });
              } else {
                this.lstModeloProductos = res1.lstModelo_Productos;
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
    });
  }

  comprar(modeloproducto: ModeloProductosEntity){
    this.httpServiceModeloproductos.asignarModeloProducto(modeloproducto);
    console.log(modeloproducto);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios-comprar'] } }]);
  }

  get filteredModeloProductos(): ModeloProductosEntity[] {
    return this.lstModeloProductos.filter((modeloproducto) =>
      modeloproducto.modelo_producto!.toLowerCase().includes(this.searchText.toLowerCase()) ||
      modeloproducto.modelo!.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}