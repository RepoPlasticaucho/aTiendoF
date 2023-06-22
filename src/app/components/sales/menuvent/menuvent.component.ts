import { Component, OnInit } from '@angular/core';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { MarcasService } from 'src/app/services/marcas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import {
  faShoppingBag,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { MarcasEntity } from 'src/app/models/marcas';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-menuvent',
  templateUrl: './menuvent.component.html',
  styleUrls: ['./menuvent.component.css'],
})
export class MenuventComponent implements OnInit {
  searchText: string = '';
  faShoppingBag = faShoppingBag;
  faShoppingCart = faShoppingCart;
  // Nueva propiedad para las tarjetas de la página actual
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];
  // Propiedades para el paginador
  totalItems = 0;
  itemsPerPage = 16;
  currentPage = 0;

  constructor(
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceMarcas: MarcasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: false,
      info: true,
      responsive: true
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los productos.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        const almacenNew: AlmacenesEntity = {
          idAlmacen: localStorage.getItem('almacenid')!,
          sociedad_id: '',
          nombresociedad: '',
          direccion: '',
          telefono: '',
          codigo: '',
          pto_emision: '',
        };
        this.httpServiceInventarios.obtenerPortafolios(almacenNew).subscribe((res1) => {
            if (res1.codigoError != 'OK') {
              Swal.fire({
                icon: 'error',
                title: 'No se pudo obtener los productos.',
                text: res1.descripcionError,
                showConfirmButton: false,
              });
            } else {
              this.lstInventarios = res1.lstInventarios;
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

  comprar(inventario: InventariosEntity) {
    this.httpServiceInventarios.asignarInventario(inventario);
    //this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios-comprar'] } }]);
  }

  verCarrito() {
    //this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['carrito'] } }]);
  }

  
}
