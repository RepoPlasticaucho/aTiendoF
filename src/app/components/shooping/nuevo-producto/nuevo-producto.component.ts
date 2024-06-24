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
import { TarifasEntity } from 'src/app/models/tarifas';
import { TarifasService } from 'src/app/services/tarifas.service';
import { ProveedoresProductosEntity } from 'src/app/models/proveedoresproductos';
import { ProveedoresproductosService } from 'src/app/services/proveedoresproductos.service';
import { finalize } from 'rxjs';


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
    medida: new FormControl('0', [Validators.required]),
    producto: new FormControl('', [Validators.required]),
    etiquetas: new FormControl('', [Validators.required]),
    tamanio: new FormControl('', [Validators.required]),
    tarifa: new FormControl('0', [Validators.required]),
    tarifaICE: new FormControl('0', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    costo: new FormControl('', [Validators.required])

  });
  //Variables para listas desplegables
  lstModeloProductos: ModeloProductosEntity[] = [];
  lstCategoriasAutoComplete: CategoriasEntity[] = [];
  lstCategorias: CategoriasEntity[] = [];
  selectCategoria: boolean = false;
  lstMarcas: MarcasEntity[] = [];
  selectMarca: boolean = false;

  lstLineas: LineasEntity[] = [];
  selectLinea: boolean = false;

  lstModelos: ModelosEntity[] = [];
  lstModelos2: ModelosEntity[] = [];
  selectModelo: boolean = false;

  lstTarifas: TarifasEntity[] = [];
  lstTarifasICE: TarifasEntity[] = [];
  lstTarifas2: TarifasEntity[] = [];
  lstTarifas3: TarifasEntity[] = [];

  selectTarifa: boolean = false;
  // lstModelos: ModelosEntity[] = [];
  // lstLineas: LineasEntity[] = [];

  //Variables para validar selección
  selectModeloProducto: boolean = false;
  selectedModeloProducto: string | undefined = '';
  selectedModeloProducto2: string | undefined = '';
  tamanio: string | undefined = '';

  //Variables para Autocomplete
  keywordModelProduct = 'modelo_producto';
  keywordCategoria = 'categoria';
  keywordLinea = 'linea';
  keywordMarca = 'marca';
  keywordModelo = 'modelo';

  disabled = true;
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
    private readonly httpServiceTarifas: TarifasService,
    private readonly httpServiceProveedoresProd: ProveedoresproductosService,
    private readonly httpServiceProv: ProveedoresService,
    private dialogRef: MatDialogRef<MenucomprComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {

    // Obtener todas las categorias
    this.httpServiceCategorias.obtenerCategorias().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las categorías.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCategorias = res.lstCategorias;
      }
    });

  //Obtener todas las lineas
  this.httpServiceLineas.obtenerLineas().subscribe(res => {
    if (res.codigoError != "OK") {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo obtener las líneas.',
        text: res.descripcionError,
        showConfirmButton: false,
      });
    } else {
      this.lstLineas = res.lstLineas;
      console.log("AQUI ESTAN LAS LINEAS", this.lstLineas);
    }
  });

  //Obtener marcas
  this.httpServiceMarcas.obtenerMarcas().subscribe(res => {
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
  }
  );

  //Obtener Modelos
  this.httpServiceModelos.obtenerModelos().subscribe(res => {
    if (res.codigoError != "OK") {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo obtener los modelos.',
        text: res.descripcionError,
        showConfirmButton: false,
      });
    } else {
      this.lstModelos = res.lstModelos;
    }
  }
  );

  //Obtener ModelosProductos

  this.httpServiceModelosProductos.obtenerModelosProductos().subscribe(res => {
    if (res.codigoError != "OK") {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo obtener los modelos productos.',
        text: res.descripcionError,
        showConfirmButton: false,
      });
    } else {
      this.lstModeloProductos = res.lstModelo_Productos;
    }
  }
  );
  



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

        //Filtrar solo las tarifas que contenga ICE
        this.lstTarifasICE = this.lstTarifas.filter((tarifa) => tarifa.descripcion?.includes('ICE'));
        //Buscar y mover la que contenga "No aplica ICE" al inicio
        let index = this.lstTarifasICE.findIndex((tarifa) => tarifa.descripcion?.includes('No aplica ICE'));
        let tarifa = this.lstTarifasICE[index];
        this.lstTarifasICE.splice(index, 1);
        this.lstTarifasICE.unshift(tarifa);


        //Eliminar todoas las que tenga ICE de lstTarifas
        this.lstTarifas = this.lstTarifas.filter((tarifa) => !tarifa.descripcion?.includes('ICE'));
        //Ordenar y poner primeros los que contenga un %
        this.lstTarifas.sort((a, b) => (a.descripcion?.includes('%') ? -1 : 1));
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

    /*
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
    */

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
          tarifa_ice_iva_id: this.lstTarifas2[0].id,
          marca_nombre: '',
          unidad_medida: this.modelProductForm.value!.medida ?? "",
          color_nombre: '',
          pvp: this.modelProductForm.value!.precio ?? "",
          atributo_nombre: '',
          genero_nombre: '',
          modelo_nombre: '',
          modelo_producto: '',
          categoria: '',
          linea: '',
          tarifa_ice_iva_id1: this.lstTarifas3[0].id,
          costo: this.modelProductForm.value!.costo ?? ""
        };


        console.log("LOS PRODUCTOS ", productEntity);

        let fecha = new Date();
        let fechaFormateada = fecha.getFullYear() + '-' +
          ('0' + (fecha.getMonth() + 1)).slice(-2) + '-' +
          ('0' + fecha.getDate()).slice(-2) + ' ' +
          ('0' + fecha.getHours()).slice(-2) + ':' +
          ('0' + fecha.getMinutes()).slice(-2) + ':' +
          ('0' + fecha.getSeconds()).slice(-2);
        this.httpService.obtenerProductosNomEti(productEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            const newProdProv: ProveedoresProductosEntity = {
              id: '',
              provedor_id: localStorage.getItem('proveedorid')!,
              producto_id: res.lstProductos[0].id,
              nombre_producto: this.modelProductForm.value!.producto ?? "",
              precio: this.modelProductForm.value!.precio ?? "",
              created_at: fechaFormateada,
              costo: this.modelProductForm.value!.costo ?? "",
              updated_at: ''
            }
            this.httpServiceProveedoresProd.agregarProductosProv(newProdProv).subscribe(res1 => {
              if (res1.codigoError == "OK") {
                Swal.fire({
                  icon: 'info',
                  title: 'Información.',
                  text: `El Producto ${this.modelProductForm.value.producto} existe`,
                  showConfirmButton: true,
                  confirmButtonText: "Ok"
                })

                console.log("entro a agregar producto prov")
                this.cerrarDialog();
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res.descripcionError,
                  showConfirmButton: false,
                });
              }
            });

          } else if (res.codigoError == 'NEXISTE') {
            this.httpService.agregarProducto(productEntity).pipe(finalize(() => {
              this.httpService.obtenerProductosNomEti(productEntity).subscribe(res2 => {
                if (res2.codigoError == "OK") {
                  const newProdProv: ProveedoresProductosEntity = {
                    id: '',
                    provedor_id: localStorage.getItem('proveedorid')!,
                    producto_id: res2.lstProductos[0].id,
                    nombre_producto: this.modelProductForm.value!.producto ?? "",
                    precio: this.modelProductForm.value!.precio ?? "",
                    created_at: fechaFormateada,
                    costo: this.modelProductForm.value!.costo ?? "",
                    updated_at: ''
                  }
                  this.httpServiceProveedoresProd.agregarProductosProv(newProdProv).subscribe(res3 => {
                    if (res3.codigoError == "OK") {
                      Swal.fire({
                        icon: 'success',
                        title: 'Guardado Exitosamente.',
                        text: `Se ha creado el Producto ${this.modelProductForm.value.producto}`,
                        showConfirmButton: true,
                        confirmButtonText: "Ok"
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.cerrarDialog();
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
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                }
              });
            })
            ).subscribe(res4 => {
              if (res4.codigoError != 'OK') {
                Swal.fire({
                  icon: 'error',
                  title: 'Ha ocurrido un error.',
                  text: res4.descripcionError,
                  showConfirmButton: false
                });
              } else {
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
        })
        /*
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
        */
      }
    }
  }

  //Disparador cuando selecciona algún item de los combos

  onChangeSearchModel(val: string) {
    if (val == '') {
      this.selectModeloProducto = true;

    }
  }

  onChangeSearchCategoria(val: string) {
    if (val == '') {
      this.selectCategoria = true;

    }
  }


  onChangeSearchLinea(val: string) {
    if (val == '') {
      this.selectLinea = true;

    }
  }

  onChangeSearchMarca(val: string) {
    if (val == '') {
      this.selectMarca = true;
 
    }
  }
  

  onChangeSearchModelo(val: string) {
    if (val == '') {
      this.selectModelo = true;

    }
  }

  //Modelo
  selectEventModel(item: ModeloProductosEntity) {
    this.selectModeloProducto = false;
    this.selectedModeloProducto = item.modelo_producto;
    this.selectedModeloProducto2 = item.modelo_producto;
    this.modelProductForm.controls['modeloproducto_id'].setValue(item.id!);

  }



  //Categoria
  selectEventCategoria(item: CategoriasEntity) {
    this.selectCategoria = false;
    this.modelProductForm.controls['categoria'].setValue(item.categoria!);


  }

  //Linea
  selectEventLinea(item: LineasEntity) {
    this.selectLinea = false;
    this.modelProductForm.controls['linea'].setValue(item.linea!);
  }

  //Marca
  selectEventMarca(item: MarcasEntity) {
    this.selectMarca = false;
    this.modelProductForm.controls['marca'].setValue(item.marca!);
  }

  //Modelo
  selectEventModelo(item: ModelosEntity) {
    this.selectModelo = false;
    this.modelProductForm.controls['modelo'].setValue(item.modelo!);
  }
  

  //Evento para cuando se limpia los cuadros de texto

  onInputClearedModel() {
    this.selectModeloProducto = true;
    this.modelProductForm.controls['modeloproducto_id'].setValue('0');
  }

  onInputClearedCategoria() {
    this.selectCategoria = true;

  }

  onInputClearedLinea() {
    this.selectLinea = true;

  }

  onInputClearedMarca() {
    this.selectMarca = true;
 
  }

  onInputClearedModelo() {
    this.selectModelo = true;

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
      const newCategoria: CategoriasEntity = {
        cod_sap: '',
        categoria: this.modelProductForm.value.categoria!,
        etiquetas: '',
        almacen_id: ''
      }
      this.httpServiceLineas.obtenerLineasCategoriaAdm(newCategoria).subscribe(res => {
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
      this.httpServiceMarcas.obtenerMarcaLinea(linea).subscribe((res) => {
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener los Modelos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
          this.lstMarcas = [];
        } else {
          this.lstMarcas = res.lstMarcas;
        }
      });
      /*
      this.httpServiceModelos.obtenerModelosLineasAdm(linea).subscribe((res) => {
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
      */
    }
  }


  changeGroup3(modelo: any): void {
    if (modelo.target.value == 0) {
      this.selectModelo = true;
    } else {
      this.selectModelo = false;

      // Obtener ID del modelo
      this.selectedModeloProducto = modelo.target.value;
      this.selectedModeloProducto2 = modelo.target.value;
      const modelonew: ModelosEntity = {
        id: '',
        marca_id: '',
        linea_id: '',
        modelo: modelo.target.value,
        etiquetas: '',
        cod_sap: ''
      }
      this.httpServiceModelosProductos.obtenerModeloProductosModelosAdm2(modelonew).subscribe((res) => {
        if (res.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener Modelos Productos.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstModeloProductos = res.lstModelo_Productos;
        }
      });
    }
  }


  changeGroupCategoria(modelo: any): void {
    if (modelo.target.value == 0) {
      this.selectModelo = true;
    } else {
      this.selectModelo = false;
      //Obtener todas las categorias
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


  changeGroup5(event: any): void {
    if (event.target.value == 0) {
      this.selectTarifa = true;
    } else {
      this.selectTarifa = false;

      // Obtener ID de la tarifa ICE
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
          this.lstTarifas3 = res.lstTarifas;
        }
      });
    }
  }

  tamanioInp() {
    this.selectedModeloProducto2 = this.selectedModeloProducto?.concat(' ' + this.tamanio!);
  }

  changeMark(marca: any): void {
    if (marca.target.value == 0) {
      this.selectMarca = true;
    } else {
      this.selectMarca = false;

      this.httpServiceModelos.obtenerModelosLineasMarcas(this.modelProductForm.value.linea!, marca.target.value).subscribe((res1) => {
        if (res1.codigoError != 'OK') {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las categorías.',
            text: res1.descripcionError,
            showConfirmButton: false,
          });
          this.lstModelos = [];
        } else {
          this.lstModelos = res1.lstModelos;
        }
      });

    }
  }

}
