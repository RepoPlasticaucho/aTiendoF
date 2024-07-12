import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faMoneyBillAlt, faBoxes, faTable } from '@fortawesome/free-solid-svg-icons';
import { Subject, subscribeOn } from 'rxjs';
import { InventariosEntity } from 'src/app/models/inventarios';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { InventariosService } from 'src/app/services/inventarios.service';
import Swal from 'sweetalert2';
import { CategoriasEntity } from 'src/app/models/categorias';
import { LineasEntity } from 'src/app/models/lineas';
import { SociedadesEntity } from 'src/app/models/sociedades';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-inventariostodo-pedido',
  templateUrl: './all-inventario-cliente.component.html',
  styleUrls: ['./all-inventario-cliente.component.css']
})
export class AllInventario implements OnInit {

  ///Iconos para la pagina de grupos
  faUserFriends = faUserFriends;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faMoneyBillAlt = faMoneyBillAlt;
  faPlus = faPlus;
  faBoxes = faBoxes;
  faTable = faTable;
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


    //Crear la sociedad
    const sociedad: SociedadesEntity = {
      idGrupo: '',
      idSociedad: localStorage.getItem('sociedadid') || "[]",
      nombreGrupo: '',
      razon_social: '',
      nombre_comercial: '',
      id_fiscal: '',
      id_fiscal_grupo: '',
      email: '',
      telefono: '',
      password: '',
      funcion: '',
      tipo_ambienteid: '',
      url_certificado: '',
      clave_certificado: '',
      dir1: '',
      direccion: '',
      ambiente: '',
      email_certificado: '',
      pass_certificado: '',
      sociedad_pertenece: '',
      almacen_personal_id: '',
      emite_retencion: '',
      obligado_contabilidad: '',
      url_logo: ''
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
            console.log("Esta es la sociedad", sociedad);
            this.httpService.obtenerPortafoliosTodos(sociedad).subscribe(res => {
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


  
  
  exportarAXLSX() {

    const renombrar = this.lstInventarios.map(inventario => {
        // Renombrar las propiedades del objeto
        return {
            'NOMBRE PRODUCTO': inventario.producto_nombre,
            'CANTIDAD OPTIMA': inventario.stock_optimo,
            'STOCK': inventario.stock,
            'COSTO': inventario.costo,
            'PRECIO': inventario.pvp2, // Revisar este valor, no parece correcto
            'ALMACEN': inventario.almacen,
        };
    });

      // Crear un nuevo libro de Excel
      const wb = XLSX.utils.book_new();

      // Convertir los datos de la tabla a una hoja de Excel
      const wsData = XLSX.utils.json_to_sheet(renombrar);
  
      // Agregar estilos y colores
      wsData['!cols'] = [
          { width: 10 },
          { width: 20 },
          { width: 20 },
          { width: 20 },
          { width: 15 },
          { width: 15 }
      ];
  
      // Establecer los colores de fondo para las celdas de encabezado
      wsData['A1'].s = { fill: { fgColor: { rgb: 'FFFF0000' } } }; // Rojo
      wsData['B1'].s = { fill: { fgColor: { rgb: 'FF00FF00' } } }; // Verde
      wsData['C1'].s = { fill: { fgColor: { rgb: 'FF0000FF' } } }; // Azul
      wsData['D1'].s = { fill: { fgColor: { rgb: 'FFFFFF00' } } }; // Amarillo
      wsData['E1'].s = { fill: { fgColor: { rgb: 'FFFF00FF' } } }; // Magenta
      wsData['F1'].s = { fill: { fgColor: { rgb: 'FF00FFFF' } } }; // Cian
  
      // Agregar la hoja de Excel al libro
      XLSX.utils.book_append_sheet(wb, wsData, 'Movimientos');
  
      // Generar el archivo Excel y guardarlo
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const fecha = `${day}-${month}-${year}`;
  
  
      this.saveExcelFile(excelBuffer, `InventarioGeneral_${fecha}.xlsx`);
    }  
  
    private saveExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
      const url: string = window.URL.createObjectURL(data);
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
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
