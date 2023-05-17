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
  variable : string | undefined;

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
          
          //CARGA DE CATEGORIAS.
          const catalogoCategorias = [...new Set(res.lstCatalogos.map(item => item.categoria))];
          catalogoCategorias.forEach((value) =>{
            
            const categoria : CategoriasEntity ={
              id: '',
              categoria: value,
              cod_sap: '',
              etiquetas: '',
              almacen_id: '',
            }   
            // console.log(categoria);
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
                console.log("No hay Categorias Nuevas");
              } 
            });
          });

        //// CARGA DE MARCAS
          const catalogoMarcas = [...new Set(res.lstCatalogos.map(item => item.marca))];
          catalogoMarcas.forEach((value) =>{
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
                console.log("No hay Marcas Nuevas");
              } 
            });  
          });

          ///CARGA DE ATRIBUTOS
          const catalogoAtributos = [...new Set(res.lstCatalogos.map(item => item.caracteristica))];
          catalogoAtributos.forEach((value) =>{
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
                console.log("No hay Caracteristicas Nuevas");
              } 
            });  
          });

         ///CARGA DE COLORES
          const catalogoColores = [...new Set(res.lstCatalogos.map(item => item.color))];
          catalogoColores.forEach((value) =>{
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
                console.log("No hay Colores Nuevos");
              } 
            });  
          });

         ///CARGA DE GENEROS
         const catalogoGeneros = [...new Set(res.lstCatalogos.map(item => item.genero))];
         catalogoGeneros.forEach((value) =>{
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
               console.log("No hay Generos Nuevos");
             } 
           });  
         });
      }
    });
    
    ///CARGA DE LINEAS
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
                  console.log("No hay Lineas Nuevas");
                }
            })
          });          
        } 
    });

    ///// FUNCION PARA CARGAR MODELOS
    this.httpService.obtenerCatalogoModelos().subscribe(res =>{
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      } else {
          res.lstCatalogos.forEach((value) => {
            const modelo : ModelosEntity={
              linea_id: '',
              linea_nombre: value.tipo,
              modelo: value.producto,
              etiquetas: '',
              cod_sap: ''
            }
            //  console.log(modelo);
            
            this.httpService.obtenerCatalogoModelo(modelo).subscribe(res => {
                if (res.codigoError != "OK") {

                  const linea : LineasEntity ={
                    linea: value.tipo,
                    etiquetas: '',
                    cod_sap: '',
                    almacen_id: '',
                    categoria_nombre :value.categoria
                  }
                 // console.log(linea);
                 this.httpService.obtenerLineaNombre(linea).subscribe(res=>{
                    const lstLin = res.lstLineas; 
                    lstLin.forEach((valor) => {
                      const modelonew :ModelosEntity={
                        linea_id: valor.id!,
                        modelo: value.producto,
                        etiquetas: value.producto,
                        cod_sap: value.linea_producto_id
                      }
                    //  console.log(modelonew);
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
                    });
                 })
                } else {
                  console.log("No hay Modelos nuevos")
                  console.log(res.lstModelos);
                  res.lstModelos.forEach((val) => {
                    const modelonew :ModelosEntity={
                      linea_id: val.linea_id,
                      modelo: val.modelo,
                      etiquetas: val.modelo,
                      cod_sap: value.linea_producto_id,
                      id:val.id
                    }
                  //  console.log(modelonew);
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
      })    
  }

  onMigrar(){
    this.httpService.obtenerCatalogoModeloProductos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      } else {

        res.lstCatalogos.forEach((value) => {
            const modelo_producto : ModeloProductosEntity ={
              marca_id: '',
              marca : value.marca,
              modelo_id: '',
              modelo: value.producto,
              color_id: '',
              color: value.color,
              atributo_id: '',
              atributo: value.caracteristica,
              genero_id: '',
              genero: value.genero,
              modelo_producto: value.moelo_producto,
              cod_sap: value.subfamilia,
              cod_familia: value.familia,
              url_image: ''
            }

            //console.log(modelo_producto);
            this.httpService.obtenerCatalogoModeloProducto(modelo_producto).subscribe(res =>{
              if (res.codigoError != "OK") {

                const color :ColorsEntity={
                  id: '',
                  color: value.color,
                  cod_sap: '',
                  etiquetas: ''
                }

                this.httpService.obtenerColoresNombre(color).subscribe(res=>{

                  const genero : GenerosEntity={
                    id: '',
                    genero:value.genero,
                    etiquetas: ''
                  }
                  const colorid = res.lstColors[0].id;
                  const colorn = res.lstColors[0].color;

                  this.httpService.obtenerGenerosNombre(genero).subscribe(res =>{
                    const generoid = res.lstGeneros[0].id;
                    const generon = res.lstGeneros[0].genero
                    
                    const atributo : AtributosEntity ={
                      id: '',
                      atributo: value.caracteristica,
                      etiquetas: ''
                    }

                    this.httpService.obtenerAtributoNombre(atributo).subscribe(res =>{
                      
                      //console.log(res);
                      const atributoid = res.lstAtributos[0].id;
                      const atributon = res.lstAtributos[0].atributo;

                      const marca : MarcasEntity={
                        id: '',
                        marca: value.marca,
                        etiquetas: '',
                        url_image: ''
                      }

                      this.httpService.obtenerMarcasNombre(marca).subscribe(res =>{
                        const marcaid = res.lstMarcas[0].id;
                        const marcan = res.lstMarcas[0].marca;
                        
                        const modelo : ModelosEntity ={
                          linea_id: '',
                          modelo: value.producto,
                          etiquetas: '',
                          cod_sap: ''
                        }
                        this.httpService.obtenerModeloNombre(modelo).subscribe(res =>{
                          const modeloid = res.lstModelos[0].id;
                          const modelon = res.lstModelos[0].modelo;

                          const modelo_productonew : ModeloProductosEntity ={
                            marca_id: marcaid,
                            marca: marcan,
                            modelo_id: modeloid!,
                            modelo: modelon,
                            color_id: colorid,
                            color: colorn,
                            atributo_id: atributoid,
                            atributo:atributon,
                            genero_id: generoid,
                            genero: generon,
                            modelo_producto: value.moelo_producto,
                            cod_sap: value.subfamilia,
                            cod_familia: value.familia,
                            etiquetas : value.moelo_producto,
                            url_image : ''
                          }
                          this.httpService.agregarModeloProducto(modelo_productonew).subscribe(res=>{
                            if (res.codigoError == "OK") {
                              Swal.fire({
                                icon: 'success',
                                title: 'Guardado Exitosamente.',
                                text: `Se ha creado los Productos`,
                                showConfirmButton: true,
                                confirmButtonText: "Ok"
                              });                            }else{
                              Swal.fire({
                                icon: 'error',
                                title: 'Ha ocurrido un error en la crecacion de los Modelos Productos.',
                                text: res.descripcionError,
                                showConfirmButton: false,
                              });
                            }
                          })
                        })
                      })
                    })
                  })
                })

              } else {
                console.log("No hay modelo_productos nuevos")
              }
            })

        });
      }
    })
  }
  onMigrarSKU(){
    this.httpService.obtenerCatalogoProductos().subscribe(res =>{
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: res.descripcionError,
          showConfirmButton: false,
        }); 
      } else {
          
          res.lstCatalogos.forEach((value) => {

          const producto : ProducAdmEntity ={
            id: '',
            tamanio: '',
            nombre: value.material,
            cod_sap: value.codigo,
            etiquetas: value.material,
            es_plasticaucho: '',
            es_sincronizado: '',
            modelo_producto_id: '',
            modelo_producto: '',
            impuesto_id: '',
            impuesto_nombre: '',
            marca_nombre: '',
            color_nombre: '',
            atributo_nombre: '',
            genero_nombre: '',
            modelo_nombre: ''
          }
          this.httpService.obtenerCatalogoProducto(producto).subscribe(res =>{
            if (res.codigoError != "OK") {
              const modelo_producto : ModeloProductosEntity = {
                marca_id: '',
                modelo_id: '',
                color_id: '',
                atributo_id: '',
                genero_id: '',
                modelo_producto: value.moelo_producto,
                cod_sap: '',
                url_image: ''
              } 
              this.httpService.obtenerModeloProductosNombre(modelo_producto).subscribe(res =>{
                res.lstModelo_Productos.forEach((valor) => {
                  const productonew : ProducAdmEntity ={
                    id: '',
                    tamanio: value.talla,
                    nombre: value.material,
                    cod_sap: value.codigo,
                    etiquetas: value.material,
                    es_plasticaucho: '',
                    es_sincronizado: '',
                    modelo_producto_id: valor.id!,
                    modelo_producto: '',
                    impuesto_id: '',
                    impuesto_nombre: '',
                    marca_nombre: '',
                    color_nombre: '',
                    atributo_nombre: '',
                    genero_nombre: '',
                    modelo_nombre: ''
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
                      Swal.fire({
                        icon: 'success',
                        title: 'Guardado Exitosamente.',
                        text: `Se ha creado los Productos`,
                        showConfirmButton: true,
                        confirmButtonText: "Ok"
                      });
                      console.log("Productos nuevos cargados")
                    }
                  })
                });
              })
            } else {
              console.log("No hay productos nuevos")
            }
          })
        })
      
      }
    })
  }
}
