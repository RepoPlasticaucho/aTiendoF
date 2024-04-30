import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faMoneyBillAlt } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { InventariosEntity } from 'src/app/models/inventarios';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModelosEntity } from 'src/app/models/modelos';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventarios-pedido-modelos',
  templateUrl: './inventarios-pedido-modelos.component.html',
  styleUrls: ['./inventarios-pedido-modelos.component.css']
})
export class InventariosPedidoModelosComponent implements OnInit {

  private codigocategoria: string = "";
  private codigoalmacen: string = "";
  private codigolinea: string = "";
  private codigomodelo: string = "";

  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  faMoneyBillAlt = faMoneyBillAlt;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];
  sumaTotal: any;
  lstModeloProducto: ModeloProductosEntity[] = [];

  color_name: string | undefined;
  categoria_name: string | undefined;
  linea_name: string | undefined;
  modelo_name: string | undefined;

  codigocolor: string | undefined;
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
      responsive: true
    }
    


    this.httpService.obtenerInventario$.subscribe(res => {

      this.codigocategoria = res.categoria_id ?? "";
      this.codigoalmacen = res.almacen_id ?? "";
      this.codigolinea = res.linea ?? "";
      this.codigomodelo = res.modelo ?? "";

      if (this.codigocategoria || this.codigoalmacen || this.codigolinea || this.codigomodelo == null) {

        const modelo: ModelosEntity = {
          id: '',
          linea_id: '',
          modelo: this.codigomodelo,
          etiquetas: '',
          cod_sap: '',
          almacen_id: this.codigoalmacen,
          linea_nombre: this.codigolinea
        }

        const inventario: InventariosEntity = {
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
        // console.log(modelo);
        // console.log(inventario);
        Swal.fire({
          title: 'CARGANDO...',
          html: 'Se están cargando los productos.',
          timer: 30000,
          didOpen: () => {
            Swal.showLoading();
            this.httpService.obtenerPortafoliosModelos(inventario).subscribe(res => {
              if (res.codigoError != "OK") {
                /*Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                  // timer: 3000
                }); */
              } else {
                this.lstInventarios = res.lstInventarios;
                this.calculateTotalSum();
                this.dtTrigger.next('');
                this.color_name = this.lstInventarios[0].color;
                this.categoria_name = this.lstInventarios[0].categoria;
                this.linea_name = this.codigolinea;
                this.modelo_name = this.codigomodelo;
                Swal.close();
                // console.log(this.lstInventarios);

                this.httpService.obtenerModelosMProducto(modelo).subscribe(res => {
                  if (res.codigoError != "OK") {
                    /* Swal.fire({
                    // icon: 'error',
                    // title: 'Ha ocurrido un error.',
                    // text: res.descripcionError,
                    // showConfirmButton: false,
                     // timer: 3000
                     });*/
                  } else {

                    this.lstModeloProducto = res.lstModelo_Productos;
                    //console.log(this.lstModeloProducto);


                  }
                })
              }
            });
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer');
          }
        });

      } else {
        if(this.router.url.includes('navegation-facturador')){
          this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['inventarios-pedido'] } }]);
          return
        }
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido'] } }]);

      }
    })
  }

  navegar(){
    let ruta = this.router.url;

    if(ruta.includes('navegation-cl')){
      this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido'] } }]);
    }

    if(ruta.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['inventarios-pedido'] } }]);
    }
  }

  isStockBelowOptimal(stock: string, stockOptimo: string): boolean {
    const stock1: number = parseFloat(stock);
    const stockOptimo1: number = parseFloat(stockOptimo);
    return stock1 < stockOptimo1;
  }

  calculateTotalSum(): void {
    this.sumaTotal = this.lstInventarios.reduce((total, inventario) => {
      return total + parseFloat(inventario.pvp2!);
    }, 0).toFixed(2);
  }

  buscarPortafolioModeloColor(card: ModeloProductosEntity) {
    this.codigocolor = card["color"];

    const inventario: InventariosEntity = {
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
      color: this.codigocolor!,
      modelo: this.codigomodelo
    }
    //console.log(inventario);
    this.httpService.asignarColor(inventario);

    if(this.router.url.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['inventarios-pedido-colores'] } }]);
      return
    }
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-colores'] } }]);
  }

  returncategoria() {

    const inventario: InventariosEntity = {
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
    if(this.router.url.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['inventarios-pedido-categoria'] } }]);
      return
    }
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-categoria'] } }]);
  }

  returnLinea() {

    const inventario: InventariosEntity = {
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
    if(this.router.url.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['inventarios-pedido-lineas'] } }]);
      return
    }
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-lineas'] } }]);
  }
}
