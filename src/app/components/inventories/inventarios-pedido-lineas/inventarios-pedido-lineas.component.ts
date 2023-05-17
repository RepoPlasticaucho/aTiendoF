import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { CategoriasEntity } from 'src/app/models/categorias';
import { InventariosEntity } from 'src/app/models/inventarios';
import { LineasEntity } from 'src/app/models/lineas';
import { ModelosEntity } from 'src/app/models/modelos';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-inventarios-pedido-lineas',
  templateUrl: './inventarios-pedido-lineas.component.html',
  styleUrls: ['./inventarios-pedido-lineas.component.css']
})
export class InventariosPedidoLineasComponent implements OnInit {
  private codigocategoria: string = "";
  private codigoalmacen :string ="";
  private codigolinea :string ="";
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;

  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];
  lstModelos: ModelosEntity[] = [];
  codigomodel: string | undefined;
  linea_name: string |  undefined;
  categoria_name: string |  undefined;

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
    this.httpService.obtenerInventario$.subscribe(res => {
        
      this.codigocategoria = res.categoria_id ?? "";
      this.codigoalmacen = res.almacen_id ?? "";
      this.codigolinea = res.linea ?? "";

      if (this.codigocategoria || this.codigoalmacen || this.codigolinea == null) {
       
        
        const linea : LineasEntity ={
          id: '',
          categoria_id: '',
          linea: this.codigolinea,
          etiquetas: '',
          cod_sap: '',
          almacen_id: this.codigoalmacen
        }

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

        this.httpService.obtenerPortafoliosLineas(inventario).subscribe(res => {
          console.log(res);

          if (res.codigoError != "OK") {
            /*Swal.fire({
             // icon: 'error',
             // title: 'Ha ocurrido un error.',
             // text: res.descripcionError,
             // showConfirmButton: false,
             // timer: 3000
            });
            //this.linea_name = this.lstModelos[0].linea_nombre;
            //console.log(res)*/
          } else {
            this.lstInventarios = res.lstInventarios;
            this.dtTrigger.next('');

            this.categoria_name = res.lstInventarios[0].categoria;
            this.linea_name = res.lstInventarios[0].linea;

            this.httpService.obtenerModelosLineas(linea).subscribe(res => {
              if (res.codigoError != "OK") {
                /*Swal.fire({
                 // icon: 'error',
                 // title: 'Ha ocurrido un error.',
                 // text: res.descripcionError,
                 // showConfirmButton: false,
                  // timer: 3000
                });*/
              } else {
                this.lstModelos = res.lstModelos;
                //console.log(this.lstModelos);
                
                
              }
            })
          }
        })
       
      }
      
      else{
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido'] } }]);

      }
      

    })
  }


  buscarPortafolioLineaModelo(card : ModelosEntity){
    this.codigomodel = card["modelo"];
    
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
      modelo: this.codigomodel
    }
    console.log(inventario);
    this.httpService.asignarModelo(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-modelos'] } }]);
  }  

  returnLinea(){
    
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
}
