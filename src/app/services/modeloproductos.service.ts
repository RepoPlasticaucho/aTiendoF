import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ModeloProductos, ModeloProductosEntity } from '../models/modeloproductos';

const initModelProduct: ModeloProductosEntity = {
  id: "",
  atributo: "",
  atributo_id: "",
  cod_familia: "",
  categoria: "",
  linea: "",
  cod_sap: "",
  color: "",
  color_id: "",
  genero: "",
  genero_id: "",
  marca: "",
  marca_id: "",
  modelo: "",
  modelo_id: "",
  modelo_producto: "",
  url_image: "",
}

@Injectable({
  providedIn: 'root'
})
export class ModeloproductosService {

  private modelProduct$ = new BehaviorSubject<ModeloProductosEntity>(initModelProduct);

  constructor(private readonly http: HttpClient) { }

  get obtenermodeloproducto$(): Observable<ModeloProductosEntity> {
    return this.modelProduct$.asObservable();
  }

  asignarModeloProducto(modeloProducto: ModeloProductosEntity) {
    this.modelProduct$ = new BehaviorSubject<ModeloProductosEntity>(initModelProduct);
    this.modelProduct$.next(modeloProducto);
  }
  obtenerModelosProductos(): Observable<ModeloProductos> {
    return this.http.get<ModeloProductos>(`${environment.apiUrl}modeloProducto/ObtenerModeloProductos`);
  }
  obtenerModeloProductosModelosAdm(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/ObtenerModeloProductosModelosAdm`, modeloProducto);
  }
  agregarModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/InsertarModeloProductos`, modeloProducto);
  }
  actualizarModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/ModificarModeloProductos`, modeloProducto);
  }
  eliminarModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/EliminarModeloProductos`, modeloProducto);
  }
  deshabilitarModeloProducto(modeloProducto: ModeloProductosEntity): Observable<ModeloProductos> {
    return this.http.post<ModeloProductos>(`${environment.apiUrl}modeloProducto/DeshabilitarModeloProductos`, modeloProducto);
  }

}
