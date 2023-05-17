import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { AtributosEntity } from 'src/app/models/atributos';
import { ColorsEntity } from 'src/app/models/colors';
import { GenerosEntity } from 'src/app/models/generos';
import { MarcasEntity } from 'src/app/models/marcas';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModelosEntity } from 'src/app/models/modelos';
import { AtributosService } from 'src/app/services/atributos.service';
import { ColoresService } from 'src/app/services/colores.service';
import { GenerosService } from 'src/app/services/generos.service';
import { MarcasService } from 'src/app/services/marcas.service';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { ModelosService } from 'src/app/services/modelos.service';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { ImagenesService } from 'src/app/services/imagenes.service';
import Swal from 'sweetalert2';
import { CategoriasEntity } from 'src/app/models/categorias';
import { CategoriasService } from 'src/app/services/categorias.service';
import { LineasEntity } from 'src/app/models/lineas';
import { LineasService } from 'src/app/services/lineas.service';

@Component({
  selector: 'app-modeloproductos-create',
  templateUrl: './modeloproductos-create.component.html',
  styleUrls: ['./modeloproductos-create.component.css'],
})
export class ModeloproductosCreateComponent implements OnInit {
  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Creación de la variable para formulario
  modelProductForm = new FormGroup({
    categoria: new FormControl('0', Validators.required),
    linea: new FormControl('0', Validators.required),
    marca_id: new FormControl('0', Validators.required),
    modelo: new FormControl('0', Validators.required),
    color_id: new FormControl('0', Validators.required),
    atributo_id: new FormControl('0', Validators.required),
    genero_id: new FormControl('0', Validators.required),
    modeloProducto: new FormControl('', [Validators.required]),
    codigoSAP: new FormControl('', [Validators.required]),
    urlImagen: new FormControl(''),
  });
  
  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;

  lstLineas: LineasEntity[] = [];
  selectLinea: boolean = false;

  lstModelos: ModelosEntity[] = [];
  lstModelos2: ModelosEntity[] = [];
  selectModelo: boolean = false;
  //Variables para listas desplegables
  lstMarcas: MarcasEntity[] = [];
  lstColores: ColorsEntity[] = [];
  lstAtributos: AtributosEntity[] = [];
  lstGeneros: GenerosEntity[] = [];
  //Variables para validar selección
  selectMarcas: boolean = false;
  selectColores: boolean = false;
  selectAtributos: boolean = false;
  selectGeneros: boolean = false;
  //Variables para Autocomplete
  keywordMark = 'marca';
  keywordModel = 'modelo';
  keywordColor = 'color';
  keywordAttribute = 'atributo';
  keywordGenre = 'genero';

  //Variables para imágen
  fileToUpload: any;
  imageUrl: any =
    'https://calidad.atiendo.ec/eojgprlg/ModeloProducto/producto.png';
  imageBase64: string = '';
  imageName: string = '';
  codigoError: string = '';
  descripcionError: string = '';

  selectedModeloProducto: string | undefined = '' ;

  constructor(
    private readonly httpServiceMarcas: MarcasService,
    private readonly httpServiceModelos: ModelosService,
    private readonly httpServiceColores: ColoresService,
    private readonly httpServiceAtributos: AtributosService,
    private readonly httpServiceGeneros: GenerosService,
    private readonly httpService: ModeloproductosService,
    private readonly httpServiceCategorias: CategoriasService,
    private readonly httpServiceLineas: LineasService,
    private httpServiceImage: ImagenesService,
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
    
    //Obtenemos Colores
    this.httpServiceColores.obtenerColores().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Colores.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstColores = res.lstColors;
      }
    });
    //Obtenemos Atributos
    this.httpServiceAtributos.obtenerAtributos().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Atributos/Caracteristicas.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstAtributos = res.lstAtributos;
      }
    });
    //Obtenemos Géneros
    this.httpServiceGeneros.obtenerGeneros().subscribe((res) => {
      if (res.codigoError != 'OK') {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Géneros.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstGeneros = res.lstGeneros;
      }
    });
  }

  onSubmit(): void {
    if (!this.modelProductForm.valid) {
      this.modelProductForm.markAllAsTouched();
      if (this.modelProductForm.get('marca_id')?.value == '0') {
        this.selectMarcas = true;
      }
      if (this.modelProductForm.get('color_id')?.value == '0') {
        this.selectColores = true;
      }
      if (this.modelProductForm.get('atributo_id')?.value == '0') {
        this.selectAtributos = true;
      }
      if (this.modelProductForm.get('genero_id')?.value == '0') {
        this.selectGeneros = true;
      }
    } else {
      if (this.modelProductForm.get('marca_id')?.value == '0') {
        this.selectMarcas = true;
      } else if (this.modelProductForm.get('color_id')?.value == '0') {
        this.selectColores = true;
      } else if (this.modelProductForm.get('atributo_id')?.value == '0') {
        this.selectAtributos = true;
      } else if (this.modelProductForm.get('genero_id')?.value == '0') {
        this.selectGeneros = true;
      } else {
        if (this.imageName != '') {
          const imageEntity: ImagenesEntity = {
            imageBase64: this.imageBase64,
            nombreArchivo: this.imageName,
            codigoError: '',
            descripcionError: '',
            nombreArchivoEliminar: '',
          };
          this.httpServiceImage.agregarImagenMP(imageEntity).subscribe((res) => {
              if (res.codigoError == 'OK') {
                console.log(res);
                const modelProductEntity: ModeloProductosEntity = {
                  marca_id: this.modelProductForm.value!.marca_id ?? '',
                  modelo: this.modelProductForm.value!.modelo ?? '',
                  modelo_id: this.lstModelos2[0].id ?? '',
                  color_id: this.modelProductForm.value!.color_id ?? '',
                  atributo_id: this.modelProductForm.value!.atributo_id ?? '',
                  genero_id: this.modelProductForm.value!.genero_id ?? '',
                  modelo_producto:this.modelProductForm.value!.modeloProducto ?? '',
                  cod_sap: this.modelProductForm.value!.codigoSAP ?? '',
                  url_image:this.imageName == '' ? this.imageUrl : this.imageName,
                };
                console.log(modelProductEntity);
                this.httpService.agregarModeloProducto(modelProductEntity).subscribe((res) => {
                  if (res.codigoError == 'OK') {
                    Swal.fire({
                      icon: 'success',
                      title: 'Guardado Exitosamente.',
                      text: `Se ha creado el modelo ${this.modelProductForm.value.modeloProducto}`,
                      showConfirmButton: true,
                      confirmButtonText: 'Ok',
                    }).finally(() => {
                      this.router.navigate([
                        '/navegation-adm',
                        { outlets: { contentAdmin: ['modeloProductos'] } },
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
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              }
            });
        } else {
          const modelProductEntity: ModeloProductosEntity = {
            marca_id: this.modelProductForm.value!.marca_id ?? '',
            modelo: this.modelProductForm.value!.modelo ?? '',
            modelo_id: this.lstModelos2[0].id ?? '',
            color_id: this.modelProductForm.value!.color_id ?? '',
            atributo_id: this.modelProductForm.value!.atributo_id ?? '',
            genero_id: this.modelProductForm.value!.genero_id ?? '',
            modelo_producto: this.modelProductForm.value!.modeloProducto ?? '',
            cod_sap: this.modelProductForm.value!.codigoSAP ?? '',
            url_image: this.imageName == '' ? this.imageUrl : this.imageName
          };
          console.log(modelProductEntity);
          this.httpService
            .agregarModeloProducto(modelProductEntity)
            .subscribe((res) => {
              if (res.codigoError == 'OK') {
                Swal.fire({
                  icon: 'success',
                  title: 'Guardado Exitosamente.',
                  text: `Se ha creado el Modelo Producto ${this.modelProductForm.value.modeloProducto}`,
                  showConfirmButton: true,
                  confirmButtonText: 'Ok',
                }).finally(() => {
                  this.router.navigate([
                    '/navegation-adm',
                    { outlets: { contentAdmin: ['modeloProductos'] } },
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
  }

  visualizarModeloProductos() {
    this.router.navigate([
      '/navegation-adm',
      { outlets: { contentAdmin: ['modeloProductos'] } },
    ]);
  }

  //Disparador cuando selecciona algún item de los combos
  //Marca
  selectEventMark(item: MarcasEntity) {
    this.selectMarcas = false;
    this.modelProductForm.controls['marca_id'].setValue(item.id);
  }


  //Color
  selectEventColor(item: ColorsEntity) {
    this.selectColores = false;
    this.selectedModeloProducto = this.selectedModeloProducto?.concat(' ' + item.color);
    this.modelProductForm.controls['color_id'].setValue(item.id);
  }

  //Atributo
  selectEventAttribute(item: AtributosEntity) {
    this.selectAtributos = false;
    this.selectedModeloProducto = this.selectedModeloProducto?.concat(' ' + item.atributo);
    this.modelProductForm.controls['atributo_id'].setValue(item.id);
  }

  //Genero
  selectEventGenre(item: any) {
    this.selectGeneros = false;
    this.selectedModeloProducto = this.selectedModeloProducto?.concat(' ' + item.genero);
    this.modelProductForm.controls['genero_id'].setValue(item.id);
  }

  //Disparador cuando se escribe algún item de los combos
  onChangeSearchMark(val: string) {
    if (val == '') {
      this.selectMarcas = true;
      this.modelProductForm.controls['marca_id'].setValue('0');
    }
  }


  onChangeSearchColor(val: string) {
    if (val == '') {
      this.selectColores = true;
      this.modelProductForm.controls['color_id'].setValue('0');
    }
  }

  onChangeSearchAttribute(val: string) {
    if (val == '') {
      this.selectAtributos = true;
      this.modelProductForm.controls['atributo_id'].setValue('0');
    }
  }

  onChangeSearchGenre(val: string) {
    if (val == '') {
      this.selectGeneros = true;
      this.modelProductForm.controls['genero_id'].setValue('0');
    }
  }
  //Evento para cuando se limpia los cuadros de texto
  onInputClearedMark() {
    this.selectMarcas = true;
    this.modelProductForm.controls['marca_id'].setValue('0');
  }


  onInputClearedColor() {
    this.selectColores = true;
    this.modelProductForm.controls['color_id'].setValue('0');
  }

  onInputClearedAttribute() {
    this.selectAtributos = true;
    this.modelProductForm.controls['atributo_id'].setValue('0');
  }

  onInputClearedGenre() {
    this.selectGeneros = true;
    this.modelProductForm.controls['genero_id'].setValue('0');
  }

  onChangeFile(target: any): void {
    if (target.value != "") {
      this.fileToUpload = target.files[0];
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.imageBase64 = this.imageUrl.split(',')[1];
        this.imageName = this.fileToUpload.name;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
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
        console.log(res);
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
      const modelonew: ModelosEntity = {
        id: '',
        linea_id: '',
        almacen_id: '',
        linea_nombre: '',      
        modelo: modelo.target.value,
        etiquetas: '',
        cod_sap: ''
      }
      this.httpServiceModelos.obtenerModelosNombre(modelonew).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener la Sociedad.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstModelos2 = res.lstModelos;
        }
      })

      //this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
  }
}
