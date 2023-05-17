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
  selector: 'app-productos-create',
  templateUrl: './productos-create.component.html',
  styleUrls: ['./productos-create.component.css']
})
export class ProductosCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  modelProductForm = new FormGroup({
    modeloproducto_id: new FormControl('0', Validators.required),
    // modelo: new FormControl('',),
    // linea: new FormControl('',),
    // categoria: new FormControl('',),
    categoria: new FormControl('0',),
    linea: new FormControl('0',),
    marca_id: new FormControl('0', Validators.required),
    modelo: new FormControl('0',),
    producto: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', [Validators.required]),
    tamanio: new FormControl('', [Validators.required]),
    codigoSAP: new FormControl('', [Validators.required])
  });
  //Variables para listas desplegables
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;

  lstLineas: LineasEntity[] = [];
  selectLinea: boolean = false;

  lstModelos: ModelosEntity[] = [];
  lstModelos2: ModelosEntity[] = [];
  selectModelo: boolean = false;
  // lstModelos: ModelosEntity[] = [];
  // lstLineas: LineasEntity[] = [];
  
  //Variables para validar selección
  selectModeloProducto: boolean = false;
  selectedModeloProducto: string | undefined = '' ;
 
  //Variables para Autocomplete
  keywordModelProduct = 'modelo_producto';


  // modelo: string = '';
  // linea: string = '';
  // categoria: string = '';

  constructor(
    
    private readonly httpServiceModelosProductos: ModeloproductosService,
    //private readonly httpServiceModelos: ModelosService,
    //private readonly httpServiceLineas: LineasService,
    private readonly httpServiceModelos: ModelosService,
    private readonly httpService: ProductosAdminService,
    private readonly httpServiceCategorias: CategoriasService,
    private readonly httpServiceLineas: LineasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    // Obtener Categorías
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


    
  }

  onSubmit(): void {
    console.log(this.modelProductForm.value);
    console.log(this.modelProductForm.valid);
    if (!this.modelProductForm.valid) {
      this.modelProductForm.markAllAsTouched();
      
      if (this.modelProductForm.get('modelo_producto_id')?.value == '0') {
        this.selectModeloProducto = true;
      }
     
    } else {
      if (this.modelProductForm.get('modelo_producto_id')?.value == '0') {
        this.selectModeloProducto = true;
      
      } else {
        const productEntity: ProducAdmEntity = {
          id: '',
          tamanio: this.modelProductForm.value!.tamanio ?? "",
          nombre: this.modelProductForm.value!.producto ?? "",
          etiquetas: this.modelProductForm.value!.etiquetas ?? "",
          es_plasticaucho: '1',
          es_sincronizado: '1',
          modelo_producto_id: this.modelProductForm.value!.modeloproducto_id ?? "",
          cod_sap: this.modelProductForm.value!.codigoSAP ?? "",
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
        };
        console.log(productEntity);
        this.httpService.agregarProducto(productEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Guardado Exitosamente.',
              text: `Se ha creado el Modelo Producto ${this.modelProductForm.value.producto}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['productos'] } }]);
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
  }

  visualizarModeloProductos() {
    this.router.navigate([
      '/navegation-adm',
      { outlets: { contentAdmin: ['productos'] } },
    ]);
  }

  //Disparador cuando selecciona algún item de los combos
  
  onChangeSearchModel(val: string) {
    if (val == '') {
      this.selectModeloProducto = true;
      this.modelProductForm.controls['modeloproducto_id'].setValue('0');
    }
  }
  //Modelo
  selectEventModel(item: ModeloProductosEntity) {
    this.selectModeloProducto = false;
    this.selectedModeloProducto = item.modelo_producto;
    this.modelProductForm.controls['modeloproducto_id'].setValue(item.id!);
    // this.modelo = item.modelo!;
    /*
    const modelonew: ModelosEntity = {
      id: '',
      linea_id: '',
      almacen_id: '',
      linea_nombre: '',      
      modelo: this.modelo,
      etiquetas: '',
      cod_sap: ''
    }
    this.httpServiceModelos.obtenerLineaModelo(modelonew).subscribe(res => {
      if (res.codigoError != "OK") {
        console.log("ERROR");
      } else {
        this.lstModelos = res.lstModelos;
        this.linea = this.lstModelos[0].linea_nombre ?? ''

        const linea: LineasEntity = {
          id: '',
          categoria_id: '',
          categoria_nombre: '',
          linea: this.linea,
          etiquetas: '',
          cod_sap: '',
          almacen_id: ''
        }
        this.httpServiceLineas.obtenerCategoriaLinea(linea).subscribe(res => {
          if (res.codigoError != "OK") {
            console.log("ERROR");
          } else {
            this.lstLineas = res.lstLineas;
            this.categoria = this.lstLineas[0].categoria_nombre ?? ''
          }
        })
      }
    })
    */

  }

  //Evento para cuando se limpia los cuadros de texto
  
  onInputClearedModel() {
    this.selectModeloProducto=true;
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
        almacen_id : '',
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
      this.selectedModeloProducto = modelo.target.value;
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
      this.httpServiceModelosProductos.obtenerModeloProductosModelosAdm(modelonew).subscribe((res) => {
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
          console.log(this.lstModeloProductos)
        }
      });

      //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
  }

}
