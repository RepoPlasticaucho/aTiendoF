import { Component, OnInit } from '@angular/core';

import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faEdit, faPlus, faTrashAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

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
    private router: Router) { }

  ngOnInit(): void {
    // Obtener modelos productos
    this.httpServiceModeloproductos.obtenerModelosProductos().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Marcas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstModeloProductos = res.lstModelo_Productos;
      }
    });
  }

  verPortafolio(event: Event, modeloproducto: ModeloProductosEntity){
    event.preventDefault();
    this.httpServiceModeloproductos.asignarModeloProducto(modeloproducto);
    console.log(modeloproducto);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }

  get filteredModeloProductos(): ModeloProductosEntity[] {
    return this.lstModeloProductos.filter((modeloproducto) =>
      modeloproducto.modelo!.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}