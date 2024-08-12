import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Almacenes, AlmacenesEntity } from '../models/almacenes';
import { CategoriasEntity } from '../models/categorias';
import { Inventarios, InventariosEntity } from '../models/inventarios';
import { LineasEntity } from '../models/lineas';
import { ModelosEntity } from '../models/modelos';
import { SociedadesEntity } from '../models/sociedades';
import { ProducAdmEntity } from '../models/productadm';
import { ProveedoresProductos } from '../models/proveedoresproductos';

const initGruop: InventariosEntity = {
  categoria_id: "",
  categoria: "",
  linea_id: "",
  linea: "",
  modelo_id: "",
  marca_id: "",
  marca: "",
  modelo_producto_id: "",
  modelo_producto: "",
  idProducto: "",
  Producto: "",
  id: "",
  tarifa_ice_iva: "",
  tarifa_ice_iva_id: "",
  dInventario: "",
  producto_id: "",
  almacen_id: "",
  producto_nombre : "",
  almacen: "",
  stock: "",
  stock_optimo: "",
  etiquetas: "",
  fav: "",
  color: '',
  modelo: '',
  cantidad: '',
  costo: '',
  pvp1 : '',
  pvp2 : '',
  pvp_sugerido : '',
  url_image: '',
  cod_principal : '',
  cod_secundario : ''
}

@Injectable({
  providedIn: 'root'
})
export class InventariosService {

  private inventario$ = new BehaviorSubject<InventariosEntity>(initGruop);

  constructor(private readonly http: HttpClient) { }

  get obtenerInventario$(): Observable<InventariosEntity> {
    return this.inventario$.asObservable();
  }

  //Asignacion de Clase para la API
  asignarInventario(inventario: InventariosEntity) {
    this.inventario$.next(inventario);
  }
  asignarCategoria(inventario: InventariosEntity) {
    this.inventario$.next(inventario);
  }
  asignarLinea(inventario: InventariosEntity) {
    this.inventario$.next(inventario);
  }
  asignarModelo(inventario: InventariosEntity) {
    this.inventario$.next(inventario);
  }
  asignarColor(inventario: InventariosEntity) {
    this.inventario$.next(inventario);
  }

  // Obtencion de datos para Filtros

  obtenerModelosMProducto(modelo: ModelosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}modeloProducto/ObtenerModeloProductosModelos`, modelo );
  }

  obtenerLineasCategoria(categoria: CategoriasEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}lineas/ObtenerLineasCategoria`, categoria );
  }

  obtenerModelosLineas(linea: LineasEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}modelos/ObtenerModelosLineas`, linea );
  }

  obtenerStockTotalSociedad(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerStockTotalSociedad`, inventario );
  }

  obtenerCategoria(): Observable<Inventarios> {
    return this.http.get<Inventarios>(`${environment.apiUrl}categorias/ObtenerCategorias` );
  }
  obtenerCategoriaid(categoria: CategoriasEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}categorias/ObtenerCategoriasid`,categoria );
  }
  // Obtencion de datos para las tablas

  obtenerInventario(): Observable<Inventarios> {
    return this.http.get<Inventarios>(`${environment.apiUrl}inventarios/ObtenerInventarios`);
  }

  obtenerPortafolios(almacen: AlmacenesEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafolios`, almacen );
  }

  obtenerPortafoliosTodos(sociedad: SociedadesEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosTodos`, sociedad );
  }

  obtenerPortafoliosCategoria(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosCategoria`,inventario );
  }
  obtenerPortafoliosCategoriaSugerido(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosCategoriaSugerido`,inventario );
  }
  obtenerPortafoliosLineas(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosLineas`,inventario );
  }
  obtenerPortafoliosLineasSugerido(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosLineasSugerido`,inventario );
  }
  obtenerPortafoliosModelos(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosModelos`,inventario );
  }
  obtenerPortafoliosColores(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosModelosColores`,inventario );
  }
  obtenerInventariosExiste(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerInventarioExiste`,inventario );
  }
  obtenerInventariosAlm(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerInventarioAlm`,inventario );
  }
  //Recibe una lista de strings
  obtenerInventariosPorAlmacenes(almacenIds: string[]): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerInventariosPorAlmacenes`, almacenIds);
  }

  agregarInventario(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/InsertarInventarios`, inventario);
  }
  agregarInventarioUltimo(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/InsertarInventarioUltimo`, inventario);
  }
  actualizarInventario(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ModificarInventarios`, inventario);
  }
  actualizarInventarioEx(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ActualizarInventarioEx`, inventario);
  }
  actualizarSinc(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ActualizarSinc`, inventario);
  }
  actualizarCosto(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ActualizarCosto`, inventario);
  }
  eliminarInventarios(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/EliminarInventarios`, inventario);
  }
  deshabilitarInventarios(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/DeshabilitarInventarios`, inventario);
  }

  proveedoresCodSapId(inventario: InventariosEntity): Observable<ProveedoresProductos> {
    return this.http.post<ProveedoresProductos>(`${environment.apiUrl}productos/ObtenerProductoCodSapId`, inventario);
  }
 
  
}
