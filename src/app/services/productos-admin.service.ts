import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ProductosEditComponent } from '../components/all_components';
import { ProducAdmEntity, ProductAdm } from '../models/productadm';
import { ModeloProductosEntity } from '../models/modeloproductos';

const initProduct : ProducAdmEntity ={
  id: "",
  tamanio: "",
  nombre: "",
  cod_sap: "",
  etiquetas: "",
  es_plasticaucho: "",
  es_sincronizado: "",
  modelo_producto_id: "",
  modelo_producto: "",
  impuesto_id: "",
  impuesto_nombre: "",
  marca_nombre: "",
  color_nombre: "",
  atributo_nombre: "",
  genero_nombre: "",
  modelo_nombre: "",
  categoria: "",
  linea: ""
}

@Injectable({
  providedIn: 'root'
})
export class ProductosAdminService {
  
  private modelProduct$ = new BehaviorSubject<ProducAdmEntity>(initProduct);

  constructor(private readonly http: HttpClient) { }
  
  get obtenerproducto$(): Observable<ProducAdmEntity> {
    return this.modelProduct$.asObservable();
  }
  asignarProducto(producto: ProducAdmEntity) {
    this.modelProduct$ = new BehaviorSubject<ProducAdmEntity>(initProduct);
    this.modelProduct$.next(producto);
  }
  obtenerProductos(): Observable<ProductAdm> {
    return this.http.get<ProductAdm>(`${environment.apiUrl}productos/ObtenerProductos`);
  }
  obtenerProductosModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/ObtenerProductosModeloProducto`, modeloProducto);
  }
  obtenerProductosN(producto: ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/ObtenerProductosN`, producto);
  }
  agregarProducto(producto: ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/InsertarProductos`, producto);
  }
  eliminarProducto(producto: ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/EliminarProductos`, producto);
  }
  actualizarProducto(producto: ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/ModificarProductos`, producto);
  }
  deshabilitarProducto(producto: ProducAdmEntity): Observable<ProductAdm> {
    return this.http.post<ProductAdm>(`${environment.apiUrl}productos/DeshabilitarProductos`, producto);
  }
}
