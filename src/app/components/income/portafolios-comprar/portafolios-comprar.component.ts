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
    this.httpService.obtenerModelosProductos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {
        this.lstModeloProductos = res.lstModelo_Productos;
      }
    })
  }

  verPortafolios(event: Event){
    event.preventDefault();
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }
}
