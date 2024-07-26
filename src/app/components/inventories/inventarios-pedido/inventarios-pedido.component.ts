import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faMoneyBillAlt, faBoxes } from '@fortawesome/free-solid-svg-icons';
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


  nombreAlmacen =  localStorage.getItem('almacenNombreInventarios')!;
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
  lstCategorias: CategoriasEntity[] = [];
  cat: string | undefined;
  sumaTotal: any;
  totalRegistros: number = 0;
  mostrarDiv: boolean = false;

  
  constructor(private readonly httpService: InventariosService,
    private router: Router) { }


  verificarRutaCliente(): void {
    const ruta = this.router.url;
    this.mostrarDiv = ruta.includes('navegation-cl');
  }
  

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
    const almacen: AlmacenesEntity = {
      idAlmacen: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      sociedad_id: '',
      nombresociedad: '',
      direccion: '',
      telefono: '',
      codigo: '',
      pto_emision: ''
    }

    this.verificarRutaCliente();
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
        Swal.fire({
          title: 'CARGANDO...',
          html: 'Se están cargando los productos.',
          timer: 30000,
          didOpen: () => {
            Swal.showLoading();
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
                this.calculateTotalSum();
                this.dtTrigger.next('');
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

    })

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

  navegar(){
    let ruta = this.router.url;

    if(ruta.includes('navegation-cl')){
      this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-almacen'] } }]);
    }

    if(ruta.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador']);
    }
  }

  buscarPortafolioLinea(card: CategoriasEntity) {
    console.log(card);
    this.cat = card["id"];
    const inventario: InventariosEntity = {
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
      almacen_id: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: ''
    }
    // console.log(inventario);
    this.httpService.asignarCategoria(inventario);
    if(this.router.url.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['inventarios-pedido-categoria'] } }]);
      return
    }

    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios-pedido-categoria'] } }]);
  }

  buscarPortafolioLineaSugerido(card: CategoriasEntity) {
    console.log(card);
    this.cat = card["id"];
    const inventario: InventariosEntity = {
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
      almacen_id: JSON.parse(localStorage.getItem('almacenid') || "[]"),
      almacen: '',
      stock: '',
      stock_optimo: '',
      fav: '',
      color: '',
      modelo: ''
    }
    this.httpService.asignarCategoria(inventario);
    if(this.router.url.includes('navegation-facturador')){
      this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['pedido-sugeridos'] } }]);
      return
    }
    console.log('cliente');
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['pedido-sugeridos'] } }]);
  }

  abrirMovInv(){
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['movimiento-inventario'] } }]);
  }

  filtrarCantidadesNoOptimas(): void {
   
    const aux = this.lstInventarios;

    this.lstInventarios = this.lstInventarios.filter(inventario => {
      return this.isStockBelowOptimal(inventario.stock!, inventario.stock_optimo);
    });

    this.calculateTotalSum();
    this.dtTrigger.next('');

    this.lstInventarios = aux;

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
