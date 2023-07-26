import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ProveedoresProductosEntity } from '../models/proveedoresproductos';

const initProvProd: ProveedoresProductosEntity = {
  id: '',
  provedor_id: '',
  producto_id: '',
  nombre_producto: '',
  precio: '',
  created_at: '',
  updated_at: ''
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
  agregarProductosProv(proveedorProducto: ProveedoresProductosEntity): Observable<ProveedoresProductosEntity> {
    return this.http.post<ProveedoresProductosEntity>(`${environment.apiUrl}proveedoresproductos/AgregarProductosProv`, proveedorProducto);
  }
}
