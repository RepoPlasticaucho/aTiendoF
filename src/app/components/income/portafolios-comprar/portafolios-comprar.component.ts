import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-portafolios-comprar',
  templateUrl: './portafolios-comprar.component.html',
  styleUrls: ['./portafolios-comprar.component.css']
})
export class PortafoliosComprarComponent implements OnInit {
  faShoppingBag = faShoppingBag;
  lstModeloProductos: ModeloProductosEntity[] = [];

  constructor(private readonly httpService: ModeloproductosService,
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
          id: '',
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
          }
        })
      }
    });
    
  }

  verPortafolios(event: Event){
    event.preventDefault();
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }
}
