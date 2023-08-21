import { Component, OnInit } from '@angular/core';
import { InventariosService } from 'src/app/services/inventarios.service';
import { InventariosEntity } from 'src/app/models/inventarios';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faMoneyBillAlt, faBoxes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs/internal/Subject';
import { LineasEntity } from 'src/app/models/lineas';
import { CategoriasEntity } from 'src/app/models/categorias';


@Component({
  selector: 'app-inventarios-pedido-categoria',
  templateUrl: './inventarios-pedido-categoria.component.html',
  styleUrls: ['./inventarios-pedido-categoria.component.css']
})
export class InventariosPedidoCategoriaComponent implements OnInit {
  [x: string]: any;
  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  faPlus = faPlus;
  faBoxes = faBoxes;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstInventarios: InventariosEntity[] = [];
  lstLineas: LineasEntity[] = [];
  sumaTotal: any;
  totalRegistros: number = 0;

  private codigocategoria: string = "";
  private codigoalmacen: string = "";
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
      responsive: true
    }
    this.httpService.obtenerInventario$.subscribe(res => {

      this.codigocategoria = res.categoria_id ?? "";
      this.codigoalmacen = res.almacen_id ?? "";
      if (this.codigocategoria || this.codigoalmacen == null) {
        const categoria: CategoriasEntity = {
          id: this.codigocategoria,
          categoria: '',
          cod_sap: '',
          etiquetas: '',
          almacen_id: this.codigoalmacen
        }

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

        Swal.fire({
          title: 'CARGANDO...',
          html: 'Se están cargando los productos.',
          timer: 30000,
          didOpen: () => {
            Swal.showLoading();
            this.httpService.obtenerPortafoliosCategoria(inventario).subscribe(res => {
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
                this.calculateTotalSum();
                this.dtTrigger.next('');
                Swal.close();
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
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer');
          }
        });

      } else {
        this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido'] } }]);
      }

    });
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

    this.totalRegistros = this.lstInventarios.length;
  }

  buscarPortafolioLinea(card: LineasEntity) {
    this.codigolinea = card["linea"];

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
    this.httpService.asignarLinea(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-lineas'] } }]);
  }

  buscarPortafolioLineaSugerida(card: LineasEntity) {
    this.codigolinea = card["linea"];

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
    this.httpService.asignarLinea(inventario);
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-lineas'] } }]);
  }

}