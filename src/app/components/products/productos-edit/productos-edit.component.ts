import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModelosEntity } from 'src/app/models/modelos';
import { ModelosService } from 'src/app/services/modelos.service';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import Swal from 'sweetalert2';
import { LineasEntity } from 'src/app/models/lineas';
import { LineasService } from 'src/app/services/lineas.service';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-productos-edit',
  templateUrl: './productos-edit.component.html',
  styleUrls: ['./productos-edit.component.css']
})
export class ProductosEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  modelProductForm = new FormGroup({
    modeloproducto_id: new FormControl('0', Validators.required),
    modeloproducto: new FormControl('0', Validators.required),
    categoria: new FormControl('',Validators.required),
    linea: new FormControl('',Validators.required),
    marca_id: new FormControl('0', Validators.required),
    modelo: new FormControl('0',Validators.required),
    producto: new FormControl('', [Validators.required]),
    etiqueta: new FormControl('', [Validators.required]),
    tamanio: new FormControl('', [Validators.required]),
    codigoSAP: new FormControl('', [Validators.required]),
  });
  //Variables para listas desplegables
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;
  selectedModeloProducto: string | undefined = '' ;

  lstLineas: LineasEntity[] = [];
  selectLinea: boolean = false;

  lstModelos: ModelosEntity[] = [];
  lstModelos2: ModelosEntity[] = [];
  selectModelo: boolean = false;

  //Variables para validar selección
  selectModeloProductos: boolean = false;


  //Variables para Autocomplete
  keywordModelProduct = 'modelo_producto';

  //Inicialización de Autocomplete
  initialModelProduct: string = '';

  //Variable contenedor id Modelo Producto
  codigo: string = '';

  constructor(
    private readonly httpServiceModeloProductos: ModeloproductosService,
    private readonly httpService: ProductosAdminService,
    private readonly httpServiceModelos: ModelosService,
    private readonly httpServiceCategorias: CategoriasService,
    private readonly httpServiceLineas: LineasService,
    private router: Router
  ) { }

  ngOnInit(): void {

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


    //Cargar los datos Lineas Modificar
    this.httpService.obtenerproducto$.subscribe((res) => {
      if (res.id == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        }).finally(() => {
          this.router.navigate([
            '/navegation-adm',
            { outlets: { contentAdmin: ['productos'] } },
          ]);
        });
      } else {
        //Asignamos los valores a los campos
        console.log(res);
        this.codigo = res.id!;
        this.selectedModeloProducto = res.nombre;
        this.modelProductForm.get('producto')?.setValue(this.selectedModeloProducto);
        this.modelProductForm.get('codigoSAP')?.setValue(res.cod_sap);
        this.modelProductForm.get('tamanio')?.setValue(res.tamanio);
        this.modelProductForm.get('categoria')?.setValue(res.categoria!);
        this.modelProductForm.get('linea')?.setValue(res.linea!);
        this.modelProductForm.get('etiqueta')?.setValue(res.etiquetas);
        this.modelProductForm.get('modelo')?.setValue(res.modelo_nombre);
        this.modelProductForm.get('modeloproducto_id')?.setValue(res.modelo_producto_id);
        this.initialModelProduct = res.modelo_producto!;
      }
    });

    
    // Extracción de la linea
    const categoria: CategoriasEntity = {
      id: '',
      categoria: this.modelProductForm.value!.categoria ?? "",
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
      } else {
        this.lstLineas = res.lstLineas;
      }
    })

    // Extracción del modelo
    const linea: LineasEntity = {
      id: '',
      categoria_id: '',
      categoria_nombre: '',
      linea: this.modelProductForm.value!.linea ?? "",
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
      } else {
        this.lstModelos = res.lstModelos;
      }
    })

    //Obtenemos Modelos
    const modelonew: ModeloProductosEntity = {
      id: '',
      marca_id: '',
      marca: '',
      modelo_id: '',
      modelo: this.modelProductForm.value!.modelo ?? "",
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
    console.log(modelonew);
    this.httpServiceModeloProductos.obtenerModeloProductosModelosAdm(modelonew).subscribe((res) => {
      console.log(res);
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Modelos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstModeloProductos = res.lstModelo_Productos;
      }
    });
  }

  onSubmit(): void {
    console.log(this.modelProductForm.valid);
    //console.log(this.modelProductForm.value);
    //console.log(this.modelProductForm.value.modeloproducto_id);
    if (!this.modelProductForm.valid) {
      this.modelProductForm.markAllAsTouched();

      if (this.modelProductForm.get('modeloproducto_id')?.value == '0' || undefined) {
        this.selectModeloProductos = true;
      }
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: "Debe seleccionar el modelo producto",
        showConfirmButton: false,
      });
    } else {
      if (this.modelProductForm.get('modeloproducto_id')?.value == '0' || undefined) {
        this.selectModeloProductos = true;
      } else {
        const productEntity: ProducAdmEntity = {
          id: this.codigo,
          modelo_producto_id: this.modelProductForm.value!.modeloproducto_id ?? '',
          nombre: this.modelProductForm.value!.producto ?? '',
          cod_sap: this.modelProductForm.value!.codigoSAP ?? '',
          tamanio: this.modelProductForm.value!.tamanio ?? '',
          etiquetas: this.modelProductForm.value!.etiqueta ?? '',
          es_plasticaucho: '1',
          es_sincronizado: '1',
          modelo_producto: '',
          impuesto_id: '',
          impuesto_nombre: '',
          marca_nombre: '',
          color_nombre: '',
          atributo_nombre: '',
          genero_nombre: '',
          modelo_nombre: '',
          categoria: '',
          linea: ''
        };
        console.log(productEntity.modelo_producto_id);
        console.log(productEntity);

        this.httpService.actualizarProducto(productEntity).subscribe((res) => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Modificado Exitosamente.',
              text: `Se ha modificado el Modelo Producto ${this.modelProductForm.value.producto}`,
              showConfirmButton: true,
              confirmButtonText: 'Ok',
            }).finally(() => {
              this.router.navigate([
                '/navegation-adm',
                { outlets: { contentAdmin: ['productos'] } },
              ]);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          }
        });
      }
    }
  }

  visualizarModeloProductos() {
    this.router.navigate([
      '/navegation-adm',
      { outlets: { contentAdmin: ['productos'] } },
    ]);
  }

  //Disparador cuando selecciona algún item de los combos
  //Modelo
  selectEventModel(item: ModeloProductosEntity) {
    this.selectModeloProductos = false;
    //this.selectedModeloProducto = item.etiquetas;
    this.selectedModeloProducto = item.modelo_producto;
    this.modelProductForm.controls['modeloproducto'].setValue(item.modelo_producto);
    this.modelProductForm.controls['modeloproducto_id'].setValue(item.id!);
  }

  //Disparador cuando se escribe algún item de los combos

  onChangeSearchModel(val: string) {
    if (val == '') {
      this.selectModeloProductos = true;
      this.modelProductForm.controls['modeloproducto_id'].setValue('0');
    }
  }

  //Evento para cuando se limpia los cuadros de texto

  onInputClearedModel() {
    this.selectModeloProductos = true;
    this.modelProductForm.controls['modeloproducto_id'].setValue('0');
  }

  changeGroup1(e: any) {

    if (e.target.value == 0) {
      this.selectCategoria = true;
      this.lstLineas = [];
      this.lstModelos = [];
    } else {
      this.selectCategoria = false;
    }
    if (e.target.value == null || undefined) {
      this.lstLineas = [];
      this.lstModelos = [];
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
    } else {
      this.selectLinea = false;
    }
    if (e.target.value == null || undefined) {
      this.lstModelos = [];
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
        } else {
          this.lstModelos = res.lstModelos;
        }
      })
    }
  }

  changeGroup3(modelo: any): void {
    if (modelo.target.value == 0) {
      this.selectModelo = true;
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
      console.log(modelonew);
      this.httpServiceModeloProductos.obtenerModeloProductosModelosAdm(modelonew).subscribe((res) => {
        console.log(res);
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener Modelos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstModeloProductos = res.lstModelo_Productos;
          this.initialModelProduct = '';
        }
      });

      //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
  }
}

  //// REVISAR ESTA CON ERROR AL ACTUALIZAR.