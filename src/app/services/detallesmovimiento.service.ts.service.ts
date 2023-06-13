import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DetallesMovimiento, DetallesMovimientoEntity } from '../models/detallesmovimiento';

const initDetail: DetallesMovimientoEntity = {
  id: '',
  producto_id: '',
  producto_nombre: '',
  inventario_id: '',
  movimiento_id: '',
  cantidad: '',
  costo: '',
  precio: ''
}

@Injectable({
  providedIn: 'root'
})
export class DetallesmovimientoService {
  private detail$ = new BehaviorSubject<DetallesMovimientoEntity>(initDetail);

  constructor(private readonly http: HttpClient) { }

  get obtenerdetalle$(): Observable<DetallesMovimientoEntity> {
    return this.detail$.asObservable();
  }

  asignarDetalle(detallePedido: DetallesMovimientoEntity) {
    this.detail$.next(detallePedido);
  }

  agregarDetallePedido(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/InsertarDetallePedido`, detalle);
  }
}
