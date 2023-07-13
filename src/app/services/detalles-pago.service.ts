import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DetallesPago, DetallesPagoEntity } from '../models/detalles-pago';

const initDetail: DetallesPagoEntity = {
  id: '',
  movimiento_id: '',
  forma_pago_id: '',
  descripcion: '',
  valor: '',
  fecha_recaudo: '',
  created_at: '',
  updated_at: ''
}

@Injectable({
  providedIn: 'root'
})
export class DetallesPagoService {
  private detail$ = new BehaviorSubject<DetallesPagoEntity>(initDetail);

  constructor(private readonly http: HttpClient) { }

  get obtenerDetallePago$(): Observable<DetallesPagoEntity> {
    return this.detail$.asObservable();
  }

  asignarDetallePago(detalle: DetallesPagoEntity) {
    this.detail$.next(detalle);
  }

  agregarDetallePago(detalle: DetallesPagoEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/InsertarDetallePago`, detalle);
  }

}
