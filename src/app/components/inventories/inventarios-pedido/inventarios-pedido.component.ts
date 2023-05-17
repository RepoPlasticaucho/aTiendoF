import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject, subscribeOn } from 'rxjs';
import { InventariosEntity } from 'src/app/models/inventarios';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';
import { CategoriasEntity } from 'src/app/models/categorias';
import { LineasEntity } from 'src/app/models/lineas';

@Component({
  selector: 'app-inventarios-pedido',
  templateUrl: './inventarios-pedido.component.html',
  styleUrls: ['./inventarios-pedido.component.css']
})
export class InventariosPedidoComponent implements OnInit {

  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];
  lstCategorias: CategoriasEntity[] = [];
  cat : string | undefined;
  constructor(private readonly httpService: InventariosService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive:true
    }
    const almacen: AlmacenesEntity = {
      idAlmacen: JSON.parse(localStorage.getItem('almacenid')||"[]"),
      sociedad_id: '',
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }
    console.log(almacen);

    this.httpService.obtenerCategoria().subscribe(res => {
      if (res.codigoError != "OK") {
       /* Swal.fire({
          //icon: 'error',
          //title: 'Ha ocurrido un error.',
          //text: res.descripcionError,
          //showConfirmButton: false,
          // timer: 3000
        });*/
      } else {
        this.lstCategorias = res.lstCategorias;
        
        this.httpService.obtenerPortafolios(almacen).subscribe(res => {
          if (res.codigoError != "OK") {
            
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
             // showConfirmButton: false,
              // timer: 3000
            });
          } else {
            this.lstInventarios = res.lstInventarios;
            this.dtTrigger.next('');
            
          }
          
        })
      }
      
    })

  }

  buscarPortafolioLinea(card : CategoriasEntity){
    console.log(card);
    this.cat = card["id"];
    const inventario : InventariosEntity = {
      categoria_id: this.cat!,
      categoria: '',
      linea_id: '',
      linea: '',
      modelo_id: '',
      marca_id: '',
      marca: '',
      modelo_producto_id: '',
      idProducto: '',
      Producto: '',
      id: '',
      dInventario: '',
      producto_id: '',
      almacen_id: JSON.parse(localStorage.getItem('almacenid')||"[]"),
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: ''
    }
   // console.log(inventario);
    this.httpService.asignarCategoria(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-categoria'] } }]);
  }
  buscarPortafolioLineaSugerido(card : CategoriasEntity){
    console.log(card);
    this.cat = card["id"];
    const inventario : InventariosEntity = {
      categoria_id: this.cat!,
      categoria: '',
      linea_id: '',
      linea: '',
      modelo_id: '',
      marca_id: '',
      marca: '',
      modelo_producto_id: '',
      idProducto: '',
      Producto: '',
      id: '',
      dInventario: '',
      producto_id: '',
      almacen_id: JSON.parse(localStorage.getItem('almacenid')||"[]"),
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: ''
    }
   // console.log(inventario);
    this.httpService.asignarCategoria(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['pedido-sugeridos'] } }]);
  }

 
    
  /*eliminarAlmacenes(almacen: AlmacenesEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${almacen.direccion}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarAlmacen(almacen).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el grupo ${almacen.direccion}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).then(() => {
              // this.groupForm.reset();
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          }
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  agregarAlmacenes() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['crearAlmacenes'] } }]);
  }

  /*editarAlmacenes(almacen: AlmacenesEntity) {
    console.log(almacen);
    this.httpService.asignarAlmacen(almacen);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['editarAlmacenes'] } }]);
  }*/

}
function obtenerCategorias() {
  throw new Error('Function not implemented.');
}

