import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faList, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Console } from 'console';
import { mode } from 'crypto-js';
import { first, Subject, ValueFromArray } from 'rxjs';
import { AtributosEntity } from 'src/app/models/atributos';
import { CatalogosEntity } from 'src/app/models/catalogos';
import { CategoriasEntity } from 'src/app/models/categorias';
import { ColorsEntity } from 'src/app/models/colors';
import { GenerosEntity } from 'src/app/models/generos';
import { LineasEntity } from 'src/app/models/lineas';
import { MarcasEntity } from 'src/app/models/marcas';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModelosEntity } from 'src/app/models/modelos';
import { ProducAdmEntity } from 'src/app/models/productadm';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ColoresService } from 'src/app/services/colores.service';
import Swal from 'sweetalert2';
import { ModeloproductosComponent } from '../../all_components';
import { Validators } from '@angular/forms';
import { ContentObserver } from '@angular/cdk/observers';
import { ProductosAdminService } from 'src/app/services/productos-admin.service';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrls: ['./catalogos.component.css']
})
export class CatalogosComponent implements OnInit {
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstCatalogos: CatalogosEntity[] = [];
  catalogoCategorias : any;
  catalogoAtributos : any;
  catalogoGeneros : any;
  catalogoMarca : any;
  catalogoColores : any;
  
  constructor(private readonly httpService: CatalogosService,
    private router: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      pageLength:100,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive: true
    }
    
    this.httpService.obtenerCatalogo().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCatalogos = res.lstCatalogos;
        this.dtTrigger.next('');
       // console.log(res); 

        /// SEPARACION DE CAMPOS
        this.catalogoCategorias = [...new Set(res.lstCatalogos.map(item => item.categoria))];
        this.catalogoAtributos = [...new Set(res.lstCatalogos.map(item => item.caracteristica))];
        this.catalogoGeneros = [...new Set(res.lstCatalogos.map(item => item.genero))];
        this.catalogoMarca = [...new Set(res.lstCatalogos.map(item => item.marca))];
        this.catalogoColores = [...new Set(res.lstCatalogos.map(item => item.color))];

        //CARGA DE CAMPOS
        this.Categorias();
        this.Atributos();
        this.Generos();
        this.Marcas();
        this.Colores();
        this.Lineas();
        this.Modelos();
        this.ModelosProductos()
        this.Productos()

        Swal.fire({
          icon: 'info',
          title: 'Carga Masiva realizada con EXITO.',
          text: `Carga masiva realizada `,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['productos'] } }]);
        })
        
      } 

    })
    
  }

  Categorias (){
    const categorias = this.catalogoCategorias;
    categorias.forEach((value: any) => {
      const categoria : CategoriasEntity ={
        cod_sap: '',
        categoria: value,
        etiquetas: '',
        almacen_id: ''
      }
      //console.log(categoria);
      this.httpService.obtenerCategoriasNombre(categoria).subscribe(res =>{
        if (res.codigoError != "OK") {
          const categorianew : CategoriasEntity ={
            id: '',
            categoria: value,
            cod_sap: value,
            etiquetas: value,
            almacen_id: '',
          }
          this.httpService.agregarCategoria(categorianew).subscribe(res =>{
            if (res.codigoError == "OK") {
              console.log("carga de Categorias con exito ")
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error en la crecacion de las categorias.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            }
          });
        }else{
          console.log("CATEGORIAS YA EXISTENTE")
        }
      })
    });
  }

  Atributos(){
    const atributos = this.catalogoAtributos;
    atributos.forEach((value: any) => {
      const caracteristica : AtributosEntity ={
        id: "",
        atributo: value,
        etiquetas: ""
      }   
      this.httpService.obtenerAtributoNombre(caracteristica).subscribe(res =>{
        if (res.codigoError != "OK") {
          const caracteristicanew : AtributosEntity ={
            id: "",
            atributo: value,
            etiquetas: value
          }   
         // console.log(caracteristicanew)
          
          this.httpService.agregarAtributo(caracteristicanew).subscribe(res =>{
            if (res.codigoError == "OK") {
              console.log("carga de Caracteristicas con exito ")
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error en la crecacion de las Caracteristicas.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            }
          });
        }else{
          console.log("CARACTERISTICAS YA EXISTENTE");
        } 
      })
    });
  }

  Generos(){
    const generos = this.catalogoGeneros;
    generos.forEach((value: any) =>{
      const genero : GenerosEntity ={
        id: "",
        genero: value,
        etiquetas: ""
      }
      this.httpService.obtenerGenerosNombre(genero).subscribe(res =>{
        if (res.codigoError != "OK") {
           const generonew : GenerosEntity ={
           id: "",
           genero: value,
           etiquetas: ""
           } 
          //console.log(colornew)
          this.httpService.agregarGenero(generonew).subscribe(res =>{
            if (res.codigoError == "OK") {
              console.log("carga de Generos con exito ")
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error en la crecacion de los Generos.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            }
          });
        }else{
          console.log("GENEROS YA EXISTENTE");
        } 
      });  
    }); 
  }

  Marcas(){
    const marcas = this.catalogoMarca; 
    marcas.forEach((value: any) =>{
      const marca : MarcasEntity ={
        id: "",
        marca: value,
        etiquetas: "",
        url_image: ""
      }   
      this.httpService.obtenerMarcasNombre(marca).subscribe(res =>{
        if (res.codigoError != "OK") {
          const marcanew : MarcasEntity ={
            id: "",
            marca: value,
            etiquetas: value,
            url_image: ""
          }  
          //console.log(marcanew)
          this.httpService.agregarMarca(marcanew).subscribe(res =>{
            if (res.codigoError == "OK") {
              console.log("carga de Marcas con exito ")
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error en la crecacion de las Marcas.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            }
          });
        }else{
          console.log("MARCAS YA EXISTENTES");
        } 
      });  
    });
  }

  Colores(){
    const colores = this.catalogoColores; 
    colores.forEach((value: any) =>{
      const color : ColorsEntity ={
        id: "",
        color: value,
        cod_sap: "",
        etiquetas: ""
      }   
      this.httpService.obtenerColoresNombre(color).subscribe(res =>{
        if (res.codigoError != "OK") {
          const colornew : ColorsEntity ={
            id: "",
            color: value,
            cod_sap: value,
            etiquetas: value
          }   
          //console.log(colornew)
          this.httpService.agregarColor(colornew).subscribe(res =>{
            if (res.codigoError == "OK") {
              console.log("carga de Colores con exito ")
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error en la crecacion de las Colores.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            }
          });
        }else{
          console.log("COLORES YA EXISTENTES");
        } 
      });  
    });
  }

  Lineas(){
    this.httpService.obtenerCatalogoLineas().subscribe(res =>{
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      } else {
          res.lstCatalogos.forEach((value) => {
            const linea : LineasEntity ={
              linea: value.tipo,
              etiquetas: '',
              cod_sap: '',
              almacen_id: '',
              categoria_nombre : value.categoria
            }
            this.httpService.obtenerCatalogoLinea(linea).subscribe(res => {
                if (res.codigoError != "OK") {
                  const categoria : CategoriasEntity={
                    cod_sap: '',
                    etiquetas: '',
                    almacen_id: '',
                    categoria: value.categoria
                  }
                  this.httpService.obtenerCategoriaNombre(categoria).subscribe(res=>{
                    const lstCat = res.lstCategorias;

                    lstCat.forEach((valor) => {
                      const lineanew :LineasEntity={
                        linea: value.tipo,
                        etiquetas: '',
                        cod_sap: '',
                        almacen_id: '',
                        categoria_id : valor.id
                      }
                      this.httpService.agregarLinea(lineanew).subscribe(res =>{
                        if (res.codigoError == "OK") {
                          console.log("carga de Lineas con exito ")
                        }else{
                          Swal.fire({
                            icon: 'error',
                            title: 'Ha ocurrido un error en la crecacion de las Lineas.',
                            text: res.descripcionError,
                            showConfirmButton: false,
                          });
                        }
                      });
                    });
                  })
                } else {
                  console.log("LINEAS YA EXISTENTES");
                }
            })
          });          
        } 
    }); 
  }

  Modelos(){
    this.httpService.obtenerCatalogoModelos().subscribe(res =>{
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      }else{
        this.lstCatalogos = res.lstCatalogos;
        //console.log(this.lstCatalogos);
        const modelos = this.lstCatalogos; 
        modelos.forEach((valor) => {
          const modelo : ModelosEntity = {
            linea_id: valor.tipoid!,
            modelo: valor.producto,
            marca_id : valor.marcaid,
            linea_nombre: valor.tipo,
            marca_nombre: valor.marca,
            etiquetas: '',
            cod_sap: ''
          }
          //console.log(modelo);
          this.httpService.obtenerCatalogoModelo(modelo).subscribe(res => {
            if (res.codigoError != "OK") {
              const modelonew : ModelosEntity = {
                linea_id: valor.tipoid!,
                modelo: valor.producto,
                marca_id : valor.marcaid,
                linea_nombre: valor.tipo,
                marca_nombre: valor.marca,
                etiquetas: valor.producto,
                cod_sap: ''
              }
              this.httpService.agregarModelo(modelonew).subscribe(res =>{
                if (res.codigoError == "OK") {
                  console.log("carga de Modelos con exito ")
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error en la crecacion de los Modelos.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                }
              })
            }else{
              console.log("MODELOS YA EXISTENTES")
              const modelos = res.lstModelos
              modelos.forEach((val) => {
                const modelonew :ModelosEntity={
                  linea_id: val.linea_id,
                  marca_id : val.marca_id,
                  modelo: val.modelo,
                  etiquetas: val.modelo,
                  cod_sap: valor.linea_producto_id,
                  id:val.id
                }
                //console.log(modelonew);
                this.httpService.actualizarModelo(modelonew).subscribe(res =>{
                  if (res.codigoError == "OK") {
                    console.log(" Actualizacion de Modelos con exito ")
                  }else{
                    Swal.fire({
                      icon: 'error',
                      title: 'Ha ocurrido un error en la crecacion de los Modelos.',
                      text: res.descripcionError,
                      showConfirmButton: false,
                    });
                  }
                })
              });
            }  
          })    
        });  
      }
    });  
  }
  
  ModelosProductos(){
    this.httpService.obtenerCatalogoModeloProductos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      } else {
        this.lstCatalogos = res.lstCatalogos
        //console.log(this.lstCatalogos);
        const modelosproductos = this.lstCatalogos
        modelosproductos.forEach((valor) => {
          const modeloproducto : ModeloProductosEntity ={
            marca_id: valor.marcaid!,
            modelo_id: valor.productoid!,
            color_id: valor.colorid!,
            atributo_id: valor.caracteristicaid!,
            genero_id: valor.generoid!,
            modelo_producto: valor.moelo_producto,
            cod_sap: valor.subfamilia,
            cod_familia: valor.familia,
            url_image: ''
          }
          //console.log(modeloproducto);
          this.httpService.obtenerCatalogoModeloProducto(modeloproducto).subscribe(res =>{
            if (res.codigoError != "OK") {
              const modeloproductonew : ModeloProductosEntity ={
                marca_id: valor.marcaid!,
                modelo_id: valor.productoid!,
                color_id: valor.colorid!,
                atributo_id: valor.caracteristicaid!,
                genero_id: valor.generoid!,
                modelo_producto: valor.moelo_producto,
                etiquetas : valor.moelo_producto,
                cod_sap: valor.subfamilia,
                cod_familia: valor.familia,
                url_image: ''
              }
              
              this.httpService.agregarModeloProducto(modeloproductonew).subscribe(res=>{
                if (res.codigoError == "OK") {
                  Swal.fire({
                    icon: 'success',
                    title: 'Guardado Exitosamente.',
                    text: `Se ha creado los Productos`,
                    showConfirmButton: true,
                    confirmButtonText: "Ok"
                  });                            
                }else{
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error en la crecacion de los Modelos Productos.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                }
              })
            }else{
              console.log("MODELOS PRODUCTOS YA EXISTENTES") 
              const modelosproductos = res.lstModelo_Productos
              modelosproductos.forEach((val) => {
                const modeloproductonew : ModeloProductosEntity ={
                  id : val.id,
                  marca_id: val.marca_id!,
                  modelo_id: val.modelo_id!,
                  color_id: val.color_id!,
                  atributo_id: val.atributo_id!,
                  genero_id: val.genero_id!,
                  modelo_producto: val.modelo_producto,
                  etiquetas : val.modelo_producto,
                  cod_sap: valor.subfamilia,
                  cod_familia: valor.familia,
                  url_image: ''
                }
                this.httpService.actualizarModeloProducto(modeloproductonew).subscribe(res =>{
                  if (res.codigoError == "OK") {
                    console.log(" Actualizacion de Modelos  Productos con exito ")
                  }else{
                    Swal.fire({
                      icon: 'error',
                      title: 'Ha ocurrido un error en la crecacion de los Modelos Productos.',
                      text: res.descripcionError,
                      showConfirmButton: false,
                    });
                  }
                })
              });
            }
          });
        });
      }
    })
  }

  Productos(){
    this.httpService.obtenerCatalogoProductos().subscribe(res =>{
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      } else {
        this.lstCatalogos = res.lstCatalogos
        const productos = this.lstCatalogos
        //console.log(productos);
        productos.forEach((valor) => {
          const productonew : ProducAdmEntity={
            id: '',
            tamanio: valor.talla,
            nombre: valor.material,
            cod_sap: valor.codigo,
            etiquetas: valor.material,
            es_plasticaucho: '',
            es_sincronizado: '',
            modelo_producto_id: valor.modelo_producto_id,
            modelo_producto: '',
            impuesto_id: '',
            impuesto_nombre: '',
            marca_nombre: '',
            color_nombre: '',
            atributo_nombre: '',
            genero_nombre: '',
            modelo_nombre: '',
            precio_prom : '',
            pvp :valor.pvp,
            unidad_medida :valor.unidad_medidad,
            tarifa_ice_iva_id : valor.tarifa_ice_iva_id
          }
          //console.log(productonew);

          this.httpService.obtenerCatalogoProducto(productonew).subscribe(res =>{
            if (res.codigoError != "OK") {
              const productonew : ProducAdmEntity={
                id: '',
                tamanio: valor.talla,
                nombre: valor.material,
                cod_sap: valor.codigo,
                etiquetas: valor.material,
                es_plasticaucho: '',
                es_sincronizado: '',
                modelo_producto_id: valor.modelo_producto_id,
                modelo_producto: '',
                impuesto_id: '',
                impuesto_nombre: '',
                marca_nombre: '',
                color_nombre: '',
                atributo_nombre: '',
                genero_nombre: '',
                modelo_nombre: '',
                precio_prom : valor.pvp,
                pvp : valor.pvp,
                unidad_medida : valor.unidad_medidad,
                tarifa_ice_iva_id : valor.tarifa_ice_iva_id
              }

              this.httpService.agregarProducto(productonew).subscribe(res =>{
                if (res.codigoError != "OK") {
                  Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error.',
                    text: res.descripcionError,
                    showConfirmButton: false,
                  });
                } else {
                  /*Swal.fire({
                    icon: 'success',
                    title: 'Guardado Exitosamente.',
                    text: `Se ha creado los Productos`,
                    showConfirmButton: true,
                    confirmButtonText: "Ok"
                  });*/
                  console.log("Productos nuevos cargados")
                }
              })
            }else{
              const productosobt = res.lstProductos;
              productosobt.forEach((value) => {
                const productadmnew : ProducAdmEntity ={
                  id: value.id,
                  tamanio: valor.talla,
                  nombre: valor.material,
                  cod_sap: valor.codigo,
                  etiquetas: valor.material,
                  es_plasticaucho: '',
                  es_sincronizado: '',
                  modelo_producto_id: value.modelo_producto_id,
                  modelo_producto: '',
                  impuesto_id: '',
                  impuesto_nombre: '',
                  marca_nombre: '',
                  color_nombre: '',
                  atributo_nombre: '',
                  genero_nombre: '',
                  modelo_nombre: '',
                  pvp : valor.pvp,
                  unidad_medida: valor.unidad_medidad,
                  tarifa_ice_iva_id : valor.tarifa_ice_iva_id,
                }
                console.log(productadmnew);
                this.httpService.actualizarProducto(productadmnew).subscribe(res=>{
                  if (res.codigoError != "OK") {
                    Swal.fire({
                      icon: 'error',
                      title: 'Ha ocurrido un error.',
                      text: res.descripcionError,
                      showConfirmButton: false,
                    }); 
                  } else {
                    /*Swal.fire({
                      icon: 'success',
                      title: 'Guardado Exitosamente.',
                      text: `Se ha creado los Productos`,
                      showConfirmButton: true,
                      confirmButtonText: "Ok"
                    });*/
                    console.log("Productos actualizados")
                  }
                });
              });  
            }
          })
        });  
      }
    })
  }
}
