import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios-pedido-colores',
  templateUrl: './inventarios-pedido-colores.component.html',
  styleUrls: ['./inventarios-pedido-colores.component.css']
})
export class InventariosPedidoColoresComponent implements OnInit {

  private codigocategoria: string = "";
  private codigoalmacen :string ="";
  private codigolinea :string ="";
  private codigomodelo :string="";
  private codigocolor: string="";

  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];

  color_name : string | undefined;
  categoria_name : string | undefined;
  linea_name : string | undefined;
  modelo_name: string | undefined;

  codalmacen: string | undefined;
  constructor(private readonly httpService: InventariosService, private router: Router) { }


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
    this.httpService.obtenerInventario$.subscribe(res => {

      this.codigocategoria = res.categoria_id ?? "";
      this.codigoalmacen = res.almacen_id ?? "";
      this.codigolinea = res.linea ?? "";
      this.codigomodelo = res.modelo ?? "";
      this.codigocolor = res.color ??"";

      if (this.codigocategoria || this.codigoalmacen ||  this.codigolinea || this.codigomodelo || this.codigocolor == null) {
        
        const inventario : InventariosEntity = {
          categoria_id: this.codigocategoria,
          categoria: '',
          linea_id: '',
          linea: this.codigolinea,
          modelo_id: '',
          marca_id: '',
          marca: '',
          modelo_producto_id: '',
          idProducto: '',
          Producto: '',
          id: '',
          dInventario: '',
          producto_id: '',
          almacen_id: this.codigoalmacen,
          almacen: '',
          stock: '',
          stock_optimo: '',
          fav: '',
          color: this.codigocolor,
          modelo: this.codigomodelo
        }

        this.httpService.obtenerPortafoliosColores(inventario).subscribe(res => {
          if (res.codigoError != "OK") {
            /*Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
              // timer: 3000
            });*/
          } else {
            this.lstInventarios = res.lstInventarios;
            this.dtTrigger.next('');
            this.categoria_name = this.lstInventarios[0].categoria;
            this.linea_name = this.lstInventarios[0].linea;
            this.modelo_name = this.codigomodelo;
            this.color_name = this.codigocolor;
          }
          
        })

      }else{
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido'] } }]);

      }
    });

  }
  returncategoria(){
    
    const inventario : InventariosEntity = {
      categoria_id: this.codigocategoria,
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
      almacen_id: this.codigoalmacen,
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: ''
    }
    console.log(inventario);
    this.httpService.asignarCategoria(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-categoria'] } }]);
  }  

  returnLinea(){
    
    const inventario : InventariosEntity = {
      categoria_id: this.codigocategoria,
      categoria: '',
      linea_id: '',
      linea: this.codigolinea,
      modelo_id: '',
      marca_id: '',
      marca: '',
      modelo_producto_id: '',
      idProducto: '',
      Producto: '',
      id: '',
      dInventario: '',
      producto_id: '',
      almacen_id: this.codigoalmacen,
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: ''
    }
    console.log(inventario);
    this.httpService.asignarCategoria(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-lineas'] } }]);
  }  

  returnModelo(){
    
    const inventario : InventariosEntity = {
      categoria_id: this.codigocategoria,
      categoria: '',
      linea_id: '',
      linea: this.codigolinea,
      modelo_id: '',
      marca_id: '',
      marca: '',
      modelo_producto_id: '',
      idProducto: '',
      Producto: '',
      id: '',
      dInventario: '',
      producto_id: '',
      almacen_id: this.codigoalmacen,
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: this.codigomodelo
    }
    console.log(inventario);
    this.httpService.asignarCategoria(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-modelos'] } }]);
  }  
}
