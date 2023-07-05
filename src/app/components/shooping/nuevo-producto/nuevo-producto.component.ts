import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModelosEntity } from 'src/app/models/modelos';
import { ModelosService } from 'src/app/services/modelos.service';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';
import { LineasEntity } from 'src/app/models/lineas';
import { LineasService } from 'src/app/services/lineas.service';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { MarcasEntity } from 'src/app/models/marcas';
import { MatDialogRef } from '@angular/material/dialog';
import { MenucomprComponent } from '../menucompr/menucompr.component';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ProveedoresService } from 'src/app/services/proveedores.service';


@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faPlus = faPlus;
  faSave = faSave;
  faSearch = faSearch;

  lstProveedores: ProveedoresEntity[] = [];
  selectProveedor: boolean = false;
  proveedor = localStorage.getItem('proveedor')

  modelProductForm = new FormGroup({
    modeloproducto_id: new FormControl('0', Validators.required),
    categoria: new FormControl('0',),
    linea: new FormControl('0',),
    marca: new FormControl('0'),
    modelo: new FormControl('0',),
    medida: new FormControl('', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', [Validators.required]),
    tamanio: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required])
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
    private readonly httpServiceModelos: ModelosService,
    private readonly httpService: ProductosAdminService,
    private readonly httpServiceCategorias: CategoriasService,
    private readonly httpServiceLineas: LineasService,
    private readonly httpServiceProv: ProveedoresService,
    private dialogRef: MatDialogRef<MenucomprComponent>,
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

    //Obtenemos Proveedores
    this.httpServiceProv.obtenerProveedores().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener proveedores.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstProveedores = res.lstProveedores;
      }
    });

    const newProveedor: ProveedoresEntity = {
      id: '',
      id_fiscal: '',
      ciudadid: '',
      correo: '',
      direccionprov: '',
      nombre: this.proveedor!,
      telefono: ''
    }
    this.httpServiceMarcas.obtenerMarcasProveedor(newProveedor).subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las marcas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstMarcas = res.lstMarcas;
      }
    })
    
  }

  cerrarDialog(): void {
    this.dialogRef.close();
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
          cod_sap: '',
          impuesto_id: '',
          impuesto_nombre: '',
          marca_nombre: '',
          unidad_medida: this.modelProductForm.value!.medida ?? "",
          color_nombre: '',
          pvp: this.modelProductForm.value!.precio ?? "",
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
              text: `Se ha creado el Producto ${this.modelProductForm.value.producto}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            })
            this.cerrarDialog();
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
      this.httpServiceLineas.obtenerLineasCategoriaMarca(this.modelProductForm.value.categoria!, this.modelProductForm.value.marca!).subscribe(res => {
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
      this.httpServiceModelos.obtenerModelosLineasMarcas(this.modelProductForm.value!.linea ?? '', this.modelProductForm.value!.marca ?? '').subscribe((res) => {
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener los Modelos.',
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
            title: 'No se pudo obtener Modelos Productos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstModeloProductos = res.lstModelo_Productos;
          console.log(this.lstModeloProductos)
        }
      });
    }
  }

  changeMark(marca: any): void {
    if (marca.target.value == 0) {
      this.selectMarca = true;
    } else {
      this.selectMarca = false;
      const marcaNew: MarcasEntity = {
        id: '',
        marca: marca.target.value,
        etiquetas: '',
        url_image: ''
      }
      this.httpServiceCategorias.obtenerCategoriaMarca(marcaNew).subscribe((res1) => {
        if (res1.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las categorías.',
            text: res1.descripcionError,
            showConfirmButton: false,
          });
          this.lstCategorias = [];
        } else {
          this.lstCategorias = res1.lstCategorias;
        }
      });
      
    }
  }

}
