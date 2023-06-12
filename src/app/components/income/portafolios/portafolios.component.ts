import { Component, ElementRef, OnInit } from '@angular/core';

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
  filteredModeloProductos: ModeloProductosEntity[] = [];
  faShoppingBag = faShoppingBag;
  // Nueva propiedad para las tarjetas de la página actual
  pagedModeloProductos: ModeloProductosEntity[] = [];
  // Propiedades para el paginador
  totalItems = 0;
  itemsPerPage = 16;
  currentPage = 0;


  constructor(private readonly httpServiceModeloproductos: ModeloproductosService,
    private readonly httpServiceMarcas: MarcasService,
    private router: Router,
    private elementRef: ElementRef) { }

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
              url_image: '',
              etiquetas: ''
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
                this.filteredModeloProductos = this.lstModeloProductos;
                this.onPageChange({ pageIndex: 0, pageSize: this.itemsPerPage }); // Llama a onPageChange para cargar los datos de la primera página
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

  comprar(modeloproducto: ModeloProductosEntity) {
    this.httpServiceModeloproductos.asignarModeloProducto(modeloproducto);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['portafolios-comprar'] } }]);
  }


  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;

    // Actualiza las tarjetas de la página actual
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedModeloProductos = this.filteredModeloProductos.slice(startIndex, endIndex);

    // Desplaza la vista hacia la parte superior de las tarjetas
    const tarjetasElement = this.elementRef.nativeElement.querySelector('#tarjetas');
    if (tarjetasElement) {
      tarjetasElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  onSearchChange(): void {
    // Aplica el filtro de búsqueda y actualiza los elementos paginados
    this.currentPage = 1; // Reinicia la página actual al realizar una nueva búsqueda
    this.filterModeloProductos();
    this.updatePagedModeloProductos();
  }

  filterModeloProductos(): void {
    this.filteredModeloProductos = this.lstModeloProductos.filter((modeloproducto) =>
      modeloproducto.modelo_producto!.toLowerCase().includes(this.searchText.toLowerCase()) ||
      modeloproducto.modelo!.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  updatePagedModeloProductos(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedModeloProductos = this.filteredModeloProductos.slice(startIndex, endIndex);
  }

}