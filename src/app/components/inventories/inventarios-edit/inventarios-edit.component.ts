import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faSave, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModelosEntity } from 'src/app/models/modelos';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModelosService } from 'src/app/services/modelos.service';
import Swal from 'sweetalert2';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import { LineasEntity } from 'src/app/models/lineas';
import { LineasService } from 'src/app/services/lineas.service';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import { InventariosEntity } from 'src/app/models/inventarios';
import { InventariosService } from 'src/app/services/inventarios.service';

@Component({
  selector: 'app-inventarios-edit',
  templateUrl: './inventarios-edit.component.html',
  styleUrls: ['./inventarios-edit.component.css']
})
export class InventariosEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  
  //Creación de la variable para formulario
  private codigo: string = "";

  inventarioForm = new FormGroup({
    categoria: new FormControl('0', Validators.required),
    linea: new FormControl('0', Validators.required),
    modelo: new FormControl('0', Validators.required),
    modelo_producto: new FormControl('0', Validators.required),
    producto: new FormControl('0', Validators.required),
    etiquetas: new FormControl('', Validators.required),
    stock: new FormControl('', [Validators.required]),
  });

  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;

  lstLineas: LineasEntity[] = [];
  selectLinea: boolean = false;

  lstModelos: ModelosEntity[] = [];
  lstModelos2: ModelosEntity[] = [];
  selectModelo: boolean = false;

  lstModeloProductos: ModeloProductosEntity[] = [];
  lstModeloProductos2: ModeloProductosEntity[] = [];
  selectModeloProducto: boolean = false;

  lstProductos: ProducAdmEntity[] = [];
  lstProductos2: ProducAdmEntity[] = [];
  selectProductos: boolean = false;


  constructor(
    private readonly httpServiceModelos: ModelosService,
    private readonly httpService: ModeloproductosService,
    private readonly httpServiceCategorias: CategoriasService,
    private readonly httpServiceLineas: LineasService,
    private readonly httpServiceInventarios: InventariosService,
    private readonly httpServiceProductos: ProductosAdminService,
    private router: Router) { }

  ngOnInit(): void {
    // Cargar categorías
    this.httpServiceCategorias.obtenerCategorias().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCategorias = res.lstCategorias;
      }
    });

    this.httpServiceInventarios.obtenerInventario$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id ?? "";
        this.inventarioForm.get("categoria")?.setValue(res.categoria);
        this.inventarioForm.get("linea")?.setValue(res.linea);
        this.inventarioForm.get("modelo")?.setValue(res.modelo);
        this.inventarioForm.get("modelo_producto")?.setValue(res.modelo_producto!);
        this.inventarioForm.get("producto")?.setValue(res.producto_nombre!);
        this.inventarioForm.get("etiquetas")?.setValue(res.etiquetas!);
        this.inventarioForm.get("stock")?.setValue(res.stock);
      }
    });

    // Obtener línea precargada
    const categoria: CategoriasEntity = {
      id: '',
      categoria: this.inventarioForm.value!.categoria ?? "",
      cod_sap: '',
      etiquetas: '',
      almacen_id: '',
    }
    this.httpServiceLineas.obtenerLineasCategoriaAdm(categoria).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las líneas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
        this.lstLineas = [];
        this.lstModelos = [];
        this.lstModeloProductos = [];
        this.lstProductos = [];
      } else {
        this.lstLineas = res.lstLineas;
      }
    })

    // Obtener modelo precargado

    const linea: LineasEntity = {
      id: '',
      categoria_id: '',
      categoria_nombre: '',
      linea: this.inventarioForm.value!.linea ?? "",
      etiquetas: '',
      cod_sap: '',
      almacen_id: ''
    }
    this.httpServiceModelos.obtenerModelosLineasAdm(linea).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las líneas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
        this.lstModelos = [];
        this.lstModeloProductos = [];
        this.lstProductos = [];
      } else {
        this.lstModelos = res.lstModelos;
      }
    })

    // Obtener modelo_producto precargado

    const modelonew: ModeloProductosEntity = {
      id: '',
      marca_id: '',
      marca: '',
      modelo_id: '',
      modelo: this.inventarioForm.value!.modelo ?? "",
      categoria: '',
      linea: '',
      color_id: '',
      color: '',
      atributo_id: '',
      atributo: '',
      genero_id: '',
      genero: '',
      modelo_producto: '',
      cod_sap: '',
      cod_familia: '',
      etiquetas: '',
      url_image: ''
    }
    this.httpService.obtenerModeloProductosModelosAdm(modelonew).subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Modelos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
        this.lstModeloProductos = [];
        this.lstProductos = [];
      } else {
        this.lstModeloProductos = res.lstModelo_Productos;
      }
    });

    // Obtener producto precargado
    const modelonew1: ModeloProductosEntity = {
      id: '',
      marca_id: '',
      marca: '',
      modelo_id: '',
      modelo: '',
      categoria: '',
      linea: '',
      color_id: '',
      color: '',
      atributo_id: '',
      atributo: '',
      genero_id: '',
      genero: '',
      modelo_producto: this.inventarioForm.value!.modelo_producto ?? "",
      cod_sap: '',
      cod_familia: '',
      etiquetas: '',
      url_image: ''
    }
    this.httpServiceProductos.obtenerProductosModeloProducto(modelonew1).subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Modelos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
        this.lstProductos = [];
      } else {
        this.lstProductos = res.lstProductos;
      }
    });

    // Obtener ID del producto

    const productonew: ProducAdmEntity = {
      id: '',
      tamanio: '',
      nombre: this.inventarioForm.value!.producto ?? "",
      etiquetas: '',
      es_plasticaucho: '',
      es_sincronizado: '',
      modelo_producto_id: '',
      cod_sap: '',
      impuesto_id: '',
      impuesto_nombre: '',
      marca_nombre: '',
      color_nombre: '',
      atributo_nombre: '',
      genero_nombre: '',
      modelo_nombre: '',
      modelo_producto: '',
      categoria: '',
      linea: ''
    }
    this.httpServiceProductos.obtenerProductosN(productonew).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProductos2 = res.lstProductos;
      }
    })
  
  }

  onSubmit(): void {
    console.log(this.inventarioForm.value);
    console.log(this.inventarioForm.valid);
    if (!this.inventarioForm.valid) {
      this.inventarioForm.markAllAsTouched();
      console.log("Error");
    } else {
      const inventario: InventariosEntity = {
        categoria_id : '',
        categoria : '',
        linea_id : '',
        linea : '',
        modelo_id : '',
        modelo : '',
        marca_id : '',
        marca : '',
        modelo_producto_id : '',
        idProducto : '',
        Producto : '',
        id : this.codigo,
        dInventario : '',
        producto_id : this.lstProductos2[0].id ?? 0,
        almacen_id : JSON.parse(localStorage.getItem('almacenid') || "[]"),
        almacen : '',
        stock : this.inventarioForm.value!.stock ?? "",
        etiquetas: this.inventarioForm.value!.etiquetas ?? "",
        stock_optimo : '',
        fav : '',
        color : '',
      }
      console.log(inventario);

      this.httpServiceInventarios.actualizarInventario(inventario).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha actualizado el inventario`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['inventarios'] } }]);
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

  }


  visualizarProductos() {
    this.router.navigate([
      '/navegation-cl',
      { outlets: { contentClient: ['inventarios'] } },
    ]);
  }

  changeGroup1(e: any) {

    if (e.target.value == 0) {
      this.selectCategoria = true;
      this.lstLineas = [];
      this.lstModelos = [];
      this.lstModeloProductos = [];
      this.lstProductos = [];
    } else {
      this.selectCategoria = false;
    }
    if (e.target.value == null || undefined) {
      this.lstLineas = [];
      this.lstModelos = [];
      this.lstModeloProductos = [];
      this.lstProductos = [];
    } else {
      const categoria: CategoriasEntity = {
        id: '',
        categoria: e.target.value,
        cod_sap: '',
        etiquetas: '',
        almacen_id: '',
      }
      this.httpServiceLineas.obtenerLineasCategoriaAdm(categoria).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las líneas.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
          this.lstLineas = [];
          this.lstModelos = [];
          this.lstModeloProductos = [];
          this.lstProductos = [];
        } else {
          this.lstLineas = res.lstLineas;
        }
      })
    }
  }
  changeGroup2(e: any) {

    if (e.target.value == 0) {
      this.selectLinea = true;
      this.lstModelos = [];
      this.lstModeloProductos = [];
      this.lstProductos = [];
    } else {
      this.selectLinea = false;
    }
    if (e.target.value == null || undefined) {
      this.lstModelos = [];
      this.lstModeloProductos = [];
      this.lstProductos = [];
    } else {
      const linea: LineasEntity = {
        id: '',
        categoria_id: '',
        categoria_nombre: '',
        linea: e.target.value,
        etiquetas: '',
        cod_sap: '',
        almacen_id: ''
      }
      this.httpServiceModelos.obtenerModelosLineasAdm(linea).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las líneas.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
          this.lstModelos = [];
          this.lstModeloProductos = [];
          this.lstProductos = [];
        } else {
          this.lstModelos = res.lstModelos;
        }
      })
    }
  }

  changeGroup3(modelo: any): void {
    if (modelo.target.value == 0) {
      this.selectModelo = true;
      this.lstModeloProductos = [];
      this.lstProductos = [];
    } else {
      this.selectModelo = false;

      // Obtener ID del modelo
      //this.selectedModeloProducto = modelo.target.value;
      const modelonew: ModeloProductosEntity = {
        id: '',
        marca_id: '',
        marca: '',
        modelo_id: '',
        modelo: modelo.target.value,
        categoria: '',
        linea: '',
        color_id: '',
        color: '',
        atributo_id: '',
        atributo: '',
        genero_id: '',
        genero: '',
        modelo_producto: '',
        cod_sap: '',
        cod_familia: '',
        etiquetas: '',
        url_image: ''
      }
      this.httpService.obtenerModeloProductosModelosAdm(modelonew).subscribe((res) => {
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener Modelos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
          this.lstModeloProductos = [];
          this.lstProductos = [];
        } else {
          this.lstModeloProductos = res.lstModelo_Productos;
        }
      });

    }
  }

  changeGroup4(modelo_producto: any): void {
    if (modelo_producto.target.value == 0) {
      this.selectModeloProducto = true;
      this.lstProductos = [];
    } else {
      this.selectModeloProducto = false;

      // Obtener ID del modelo producto
      const modelonew: ModeloProductosEntity = {
        id: '',
        marca_id: '',
        marca: '',
        modelo_id: '',
        modelo: '',
        categoria: '',
        linea: '',
        color_id: '',
        color: '',
        atributo_id: '',
        atributo: '',
        genero_id: '',
        genero: '',
        modelo_producto: modelo_producto.target.value,
        cod_sap: '',
        cod_familia: '',
        etiquetas: '',
        url_image: ''
      }
      this.httpServiceProductos.obtenerProductosModeloProducto(modelonew).subscribe((res) => {
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener Modelos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
          this.lstProductos = [];
        } else {
          this.lstProductos = res.lstProductos;
        }
      });

      //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
  }

  changeGroup5(producto: any): void {
    if (producto.target.value == 0) {
      this.selectProductos = true;
    } else {
      this.selectProductos = false;

      // Obtener ID del producto

      const productonew: ProducAdmEntity = {
        id: '',
        tamanio: '',
        nombre: producto.target.value,
        etiquetas: '',
        es_plasticaucho: '',
        es_sincronizado: '',
        modelo_producto_id: '',
        cod_sap: '',
        impuesto_id: '',
        impuesto_nombre: '',
        marca_nombre: '',
        color_nombre: '',
        atributo_nombre: '',
        genero_nombre: '',
        modelo_nombre: '',
        modelo_producto: '',
        categoria: '',
        linea: ''
      }
      this.httpServiceProductos.obtenerProductosN(productonew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstProductos2 = res.lstProductos;
        }
      })
    }
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

}
