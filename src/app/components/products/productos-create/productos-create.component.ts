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
import { MarcasService } from 'src/app/services/marcas.service';
import { MarcasEntity } from 'src/app/models/marcas';
import { TarifasEntity } from 'src/app/models/tarifas';
import { TarifasService } from 'src/app/services/tarifas.service';

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
    marca: new FormControl('0'),
    modelo: new FormControl('0',),
    producto: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', [Validators.required]),
    tamanio: new FormControl('', [Validators.required]),
    codigoSAP: new FormControl('', [Validators.required]),
    tarifa: new FormControl('0', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    medida: new FormControl('0', [Validators.required])

  });
  //Variables para listas desplegables
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;
  lstMarcas: MarcasEntity[] = [];
  selectMarca: boolean = false;

  lstLineas: LineasEntity[] = [];
  selectLinea: boolean = false;

  lstModelos: ModelosEntity[] = [];
  lstModelos2: ModelosEntity[] = [];
  selectModelo: boolean = false;
  // lstModelos: ModelosEntity[] = [];
  // lstLineas: LineasEntity[] = [];

  lstTarifas: TarifasEntity[] = [];
  lstTarifas2: TarifasEntity[] = [];
  selectTarifa: boolean = false;
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
    private readonly httpServiceMarcas: MarcasService,
    //private readonly httpServiceModelos: ModelosService,
    //private readonly httpServiceLineas: LineasService,
    private readonly httpServiceTarifas: TarifasService,
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
    // Obtener Tarifas
    this.httpServiceTarifas.obtenerTarifas().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstTarifas = res.lstTarifas;
      }
    });
    //Obtenemos Marcas
    this.httpServiceMarcas.obtenerMarcas().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Marcas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstMarcas = res.lstMarcas;
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
          linea: '',
          tarifa_ice_iva_id : this.lstTarifas2[0].id,
          unidad_medida: this.modelProductForm.value!.medida ?? "",
          pvp: this.modelProductForm.value!.precio ?? "",
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
      this.modelProductForm.get("marca")?.setValue("0");
    } else {
      this.selectLinea = false;
    }
    if (e.target.value == null || undefined) {
      this.lstModelos = [];
      this.modelProductForm.get("marca")?.setValue("0");
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
          this.modelProductForm.get("marca")?.setValue("0");
        } else {
          this.lstModelos = res.lstModelos;
          this.modelProductForm.get("marca")?.setValue("0");
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
  changeGroup4(event: any): void {
    if (event.target.value == 0) {
      this.selectTarifa = true;
    } else {
      this.selectTarifa = false;

      // Obtener ID del modelo
      const tarifanew: TarifasEntity = {
        id: '',
        impuesto_id: '',
        codigo: '',
        porcentaje: '',
        descripcion: event.target.value,
        tarifa_ad_valorem_e_d_2020: '',
        tarifa_esp_e_d_2020: '',
        tarifa_esp_9_mayo_diciembre_2020: '',
        created_at: '',
        updated_at: ''
      }
      this.httpServiceTarifas.obtenerTarifasN(tarifanew).subscribe((res) => {
        console.log(res);
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener Tarifas.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstTarifas2 = res.lstTarifas;
        }
      });
    }
  }
  changeMark(marca: any): void {
    if (marca.target.value == 0) {
      this.selectMarca = true;
    } else {
      this.selectMarca = false;

      this.httpServiceModelos.obtenerModelosLineasMarcas(this.modelProductForm.value!.linea ?? '', marca.target.value).subscribe((res) => {
          if (res.codigoError != 'OK') {
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
        });
    }
  }

}