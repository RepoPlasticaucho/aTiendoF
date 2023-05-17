import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Atributos, AtributosEntity } from '../models/atributos';
import { Catalogos, CatalogosEntity } from '../models/catalogos';
import { Categorias, CategoriasEntity } from '../models/categorias';
import { Colors, ColorsEntity } from '../models/colors';
import { Generos, GenerosEntity } from '../models/generos';
import { Lineas, LineasEntity } from '../models/lineas';
import { Marcas, MarcasEntity } from '../models/marcas';
import { ModeloProductos, ModeloProductosEntity } from '../models/modeloproductos';
import { Modelos, ModelosEntity } from '../models/modelos';
import { ProducAdmEntity, ProductAdm } from '../models/productadm';


const initGruop: CatalogosEntity = {

    id: '',
    codigo : '',
    material: '',
    talla : '',
    subfamilia : '',
    familia : '',
    marca : '',
    tipo : '',
    producto : '',
    color : '',
    caracteristica : '',
    genero : '',
    categoria : '',
    moelo_producto : '',
    modelo_producto_id : '',
    linea_producto_id : ''
}

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  private catalogo$ = new BehaviorSubject<CatalogosEntity>(initGruop);

  constructor(private readonly http: HttpClient) { }

  get obtenerCatalogos$(): Observable<CatalogosEntity> {
    return this.catalogo$.asObservable();
  }

  //Asignacion de Clase para la API
  asignarCatalogo(catalogo: CatalogosEntity) {
    this.catalogo$.next(catalogo);
  }
  
  obtenerCatalogo(): Observable<Catalogos> {
    return this.http.get<Catalogos>(`${environment.apiUrl}catalogos/ObtenerCatalogos`);
  }
  
  //FUNCIONES OBTENER  Y AGREGAR CATEGORIAS//
  obtenerCategoriasNombre(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}categorias/ObtenerCategoriaNombre`, categoria );
  }
  agregarCategoria(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}categorias/InsertarCategorias`, categoria);
  }

  //FUNCIONES OBTENER  Y AGREGAR MARCAS//
  obtenerMarcasNombre(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcaNombre`, marca);
  }
  agregarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/InsertarMarcas`, marca);
  }

  //FUNCIONES OBTENER  Y AGREGAR COLORES//
  obtenerColoresNombre(color: ColorsEntity): Observable<Colors> {
    return this.http.post<Colors>(`${environment.apiUrl}colores/ObtenerColoresNombre`, color);
  }

  agregarColor(color: ColorsEntity): Observable<Colors> {
    return this.http.post<Colors>(`${environment.apiUrl}colores/InsertarColores`, color);
  }

  ///FUNCIONES OBTENER Y CARGAR ATRIBUTOS
  obtenerAtributoNombre(atributo: AtributosEntity): Observable<Atributos> {
    return this.http.post<Atributos>(`${environment.apiUrl}atributos/ObtenerAtributosNombre`, atributo);
  }
  agregarAtributo(atributo: AtributosEntity): Observable<Atributos> {
    return this.http.post<Atributos>(`${environment.apiUrl}atributos/InsertarAtributos`, atributo);
  }

  ///FUNCIONES OBTENER Y CARGAR GENEROS///
  obtenerGenerosNombre(genero: GenerosEntity): Observable<Generos> {
    return this.http.post<Generos>(`${environment.apiUrl}generos/ObtenerGenerosNombre`, genero);
  }

  agregarGenero(genero: GenerosEntity): Observable<Generos> {
    return this.http.post<Generos>(`${environment.apiUrl}generos/InsertarGeneros`, genero);
  }

  //// INSERTAR LINEAS//////
  obtenerCatalogoLineas(): Observable<Catalogos> {
    return this.http.get<Catalogos>(`${environment.apiUrl}catalogos/ObtenerCatalogosLineas`);
  }

  obtenerCatalogoLinea(linea: LineasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/ObtenerCatalogoLineas`, linea);
  }

  obtenerCategoriaNombre(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}categorias/ObtenerCategoriaNombre`, categoria );
  }

  agregarLinea(linea: LineasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/InsertarLineas`, linea);
  }

  //// INSERTAR ACTUALIZAR Y OBTENER MODELOS

  obtenerCatalogoModelos(): Observable<Catalogos> {
    return this.http.get<Catalogos>(`${environment.apiUrl}catalogos/ObtenerCatalogosModelos`);
  }

  obtenerCatalogoModelo(modelo: ModelosEntity): Observable<Modelos> {
    return this.http.post<Modelos>(`${environment.apiUrl}modelos/ObtenerCatalogoModelo`, modelo);
  }

  obtenerLineaNombre(linea: LineasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/ObtenerLineasNombre`, linea );
  }

  agregarModelo(modelo: ModelosEntity): Observable<Modelos> {
    return this.http.post<Modelos>(`${environment.apiUrl}modelos/InsertarModelos`, modelo);
  }
  actualizarModelo(modelo: ModelosEntity): Observable<Modelos> {
    return this.http.post<Modelos>(`${environment.apiUrl}modelos/ModificarModelos`, modelo);
  }

  /// INSERTAR ACTUALIZAR Y OBTENER MODELOS PRODUCTOS
  
  obtenerCatalogoModeloProductos(): Observable<Catalogos> {
    return this.http.get<Catalogos>(`${environment.apiUrl}catalogos/ObtenerCatalogosModelosProductos`);
  }

  ///CARGAR MODELOS PRODUCTOS
  obtenerCatalogoModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/ObtenerCatalogoModeloProductos`, modeloProducto);
  }
  obtenerModeloNombre(modelo: ModelosEntity): Observable<Modelos> {
    return this.http.post<Modelos>(`${environment.apiUrl}modelos/ObtenerModelosNombre`, modelo);
  }
  agregarModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/InsertarModeloProductos`, modeloProducto);
  }

  //CARGAR SKUS
  obtenerCatalogoProductos(): Observable<Catalogos> {
    return this.http.get<Catalogos>(`${environment.apiUrl}catalogos/ObtenerCatalogosProductos`);
  }

  obtenerCatalogoProducto(producto : ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/ObtenerCatalogosProductos`,producto);
  }

  obtenerModeloProductosNombre(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/ObtenerModeloProductosNombre`, modeloProducto);
  }

  agregarProducto(producto: ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/InsertarProductos`, producto);
  }
}
