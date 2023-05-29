import { Component, OnInit } from '@angular/core';
import { MarcasEntity } from 'src/app/models/marcas';
import { MarcasService } from 'src/app/services/marcas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { faEdit, faPlus, faTrashAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

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
    //Obtenemos Marcas
    this.httpServiceMarcas.obtenerMarcas().subscribe((res) => {
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
    console.log(marca);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios'] } }]);
  }

}
