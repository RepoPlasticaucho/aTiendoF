import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DetalleImpuestos, DetalleImpuestosEntity } from '../models/detalle-impuestos';

const initDetail: DetalleImpuestosEntity = {
  id: '',
  detalle_movimiento_id: '',
  cod_impuesto: '',
  porcentaje: '',
  base_imponible: '',
  valor: '',
  created_at: '',
  updated_at: '',
  movimiento_id: ''
}

@Injectable({
  providedIn: 'root'
})
export class DetalleImpuestosService {
  private detail$ = new BehaviorSubject<DetalleImpuestosEntity>(initDetail);

  constructor(private readonly http: HttpClient) { }

  get obtenerDetalleImpuesto$(): Observable<DetalleImpuestosEntity> {
    return this.detail$.asObservable();
  }

  obtenerDetalleImpuesto(detalle: DetalleImpuestosEntity): Observable<DetalleImpuestos> {
    return this.http.post<DetalleImpuestos>(`${environment.apiUrl}detalleimpuestos/ObtenerDetalleImpuesto`, detalle );
  }

  asignarDetalleImpuesto(detalle: DetalleImpuestosEntity) {
    this.detail$.next(detalle);
  }

  agregarDetalleImpuestos(detalle: DetalleImpuestosEntity): Observable<DetalleImpuestos> {
    return this.http.post<DetalleImpuestos>(`${environment.apiUrl}detalleimpuestos/InsertarDetalleImpuestos`, detalle);
  }

  modificarMovimientoBP(detalle: DetalleImpuestosEntity): Observable<DetalleImpuestos> {
    return this.http.post<DetalleImpuestos>(`${environment.apiUrl}detalleimpuestos/ModificarMovimientoBP`, detalle);
  }

  modificarDetalleImpuestosBP(detalle: DetalleImpuestosEntity): Observable<DetalleImpuestos> {
    return this.http.post<DetalleImpuestos>(`${environment.apiUrl}detalleimpuestos/ModificarDetalleImpuestosBP`, detalle);
  }

  modificarDetalleImpuestosVal(detalle: DetalleImpuestosEntity): Observable<DetalleImpuestos> {
    return this.http.post<DetalleImpuestos>(`${environment.apiUrl}detalleimpuestos/ModificarDetalleImpuestosVal`, detalle);
  }
}
