import { Component, OnInit } from '@angular/core';
import { MarcasEntity } from 'src/app/models/marcas';
import { MarcasService } from 'src/app/services/marcas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faEdit, faPlus, faTrashAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { CategoriasEntity } from 'src/app/models/categorias';

@Component({
  selector: 'app-vistamarcas',
  templateUrl: './vistamarcas.component.html',
  styleUrls: ['./vistamarcas.component.css']
})
export class VistamarcasComponent implements OnInit {
  lstMarcas: MarcasEntity[] = [];
  faShoppingBag = faShoppingBag;

  constructor(private readonly httpServiceMarcas: MarcasService,
    private router: Router) { }
    

  ngOnInit(): void {
    const newCategoria: CategoriasEntity = {
      categoria: localStorage.getItem('categoria')!,
      cod_sap: '',
      etiquetas: '',
      almacen_id: ''
    }
    console.log(newCategoria)
    //Obtenemos Marcas
    this.httpServiceMarcas.obtenerMarcaCategoria(newCategoria).subscribe((res) => {
      console.log(res)
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Marcas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstMarcas = res.lstMarcas;
      }
    });
  }

  verPortafolio(event: Event, marca: MarcasEntity){
    event.preventDefault();
    this.httpServiceMarcas.asignarMarca(marca);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }

}
