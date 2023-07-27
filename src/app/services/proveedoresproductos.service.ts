import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ProveedoresProductos, ProveedoresProductosEntity } from '../models/proveedoresproductos';

const initProvProd: ProveedoresProductosEntity = {
  id: '',
  provedor_id: '',
  producto_id: '',
  nombre_producto: '',
  precio: '',
  created_at: '',
  updated_at: '',
  descripcion_uni: '',
  tamanio: '',
  unidad_medida: '',
  marca: '',
  etiquetas: '',
  cantidad: ''
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresproductosService {
  private proveedorProducto$ = new BehaviorSubject<ProveedoresProductosEntity>(initProvProd);

  constructor(private readonly http: HttpClient) { }

  get obtenerProveedorProducto$(): Observable<ProveedoresProductosEntity> {
    return this.proveedorProducto$.asObservable();
  }

  asignarProveedorProducto(proveedorProducto: ProveedoresProductosEntity) {
    this.proveedorProducto$ = new BehaviorSubject<ProveedoresProductosEntity>(initProvProd);
    this.proveedorProducto$.next(proveedorProducto);
  }
  agregarProductosProv(proveedorProducto: ProveedoresProductosEntity): Observable<ProveedoresProductos> {
    return this.http.post<ProveedoresProductos>(`${environment.apiUrl}proveedoresproductos/AgregarProductosProv`, proveedorProducto);
  }
  obtenerProveedoresProductosProv(proveedorProducto: ProveedoresProductosEntity): Observable<ProveedoresProductos> {
    return this.http.post<ProveedoresProductos>(`${environment.apiUrl}proveedoresproductos/ObtenerProveedoresProductosProv`,proveedorProducto);
  }
}
