import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/internal/Subject';
import { CategoriasEntity } from 'src/app/models/categorias';
import { InventariosEntity } from 'src/app/models/inventarios';
import { LineasEntity } from 'src/app/models/lineas';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido-sugerido',
  templateUrl: './pedido-sugerido.component.html',
  styleUrls: ['./pedido-sugerido.component.css']
})
export class PedidoSugeridoComponent implements OnInit,OnDestroy {
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  lstInventarios: InventariosEntity[] = [];
  lstLineas: LineasEntity[] = [];

  private codigocategoria: string = "";
  private codigoalmacen :string ="";
  categorianame: string | undefined;
  codigolinea: string | undefined;
  
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
        if (this.codigocategoria || this.codigoalmacen == null) {
          const categoria : CategoriasEntity ={
            id: this.codigocategoria,
            categoria: '',
            cod_sap: '',
            etiquetas: '',
            almacen_id: this.codigoalmacen
          }
  
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
  
          console.log(categoria);
          console.log(inventario);

          this.httpService.obtenerPortafoliosCategoriaSugerido(inventario).subscribe(res => {
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
              this.categorianame = this.lstInventarios[0].categoria;

              this.httpService.obtenerLineasCategoria(categoria).subscribe(res => {
                if (res.codigoError != "OK") {
                  /*Swal.fire({
                   // icon: 'error',
                   // title: 'Ha ocurrido un error.',
                   // text: res.descripcionError,
                   // showConfirmButton: false,
                    // timer: 3000
                  });*/
                } else {
                  
                  this.lstLineas = res.lstLineas;

                }
                
              })
            }
            
          });
          
        } else {

          this.codigocategoria = "1";
          this.codigoalmacen = "6";

          const categoria : CategoriasEntity ={
            id: this.codigocategoria,
            categoria: '',
            cod_sap: '',
            etiquetas: '',
            almacen_id: this.codigoalmacen
          }
  
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
          
          console.log(categoria);
          console.log(inventario);

          this.httpService.obtenerPortafoliosCategoriaSugerido(inventario).subscribe(res => {
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
              this.categorianame = this.lstInventarios[0].categoria;

              this.httpService.obtenerLineasCategoria(categoria).subscribe(res => {
                if (res.codigoError != "OK") {
                  /*Swal.fire({
                   // icon: 'error',
                   // title: 'Ha ocurrido un error.',
                   // text: res.descripcionError,
                   // showConfirmButton: false,
                    // timer: 3000
                  });*/
                } else {
                  
                  this.lstLineas = res.lstLineas;

                }
                
              })
            }
            
          });
          
          
        }
        
    })
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  pedidosugerido(lstInventariosR: InventariosEntity[] ){
   
    console.log(lstInventariosR);
   // this.httpService.asignarLinea(inventario);
   // this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-lineas'] } }]);
  }

  pedidosugeridoLinea(card : LineasEntity){
    this.codigolinea = card["linea"];
    
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

    this.httpService.obtenerPortafoliosLineasSugerido(inventario).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
          // timer: 3000
        });
      } else {

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.lstInventarios = res.lstInventarios;  
          this.categorianame = this.lstInventarios[0].categoria;
          console.log(this.lstInventarios);
          this.dtTrigger.next('');
        });
        
      }
      
    });

  }
}
