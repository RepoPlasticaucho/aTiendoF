import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DetallesPago, DetallesPagoEntity } from '../models/detalles-pago';
import { AlmacenesEntity } from '../models/almacenes';
import { FormasPagoEntity } from '../models/formas-pago';
import { MovimientosEntity } from '../models/movimientos';

const initDetail: DetallesPagoEntity = {
  id: '',
  movimiento_id: '',
  forma_pago_id: '',
  descripcion: '',
  valor: '',
  fecha_recaudo: '',
  created_at: '',
  updated_at: '',
  valorE: '',
  valorTC: '',
  nombre: '',
  valorTD: ''
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
  obtenerDetallePagoMov(movimiento: MovimientosEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoMov`, movimiento);
  }
  obtenerDetallePagoMovimiento(movimiento: MovimientosEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoMovimiento`, movimiento);
  }
  obtenerDetallePagoE(almacen: AlmacenesEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoE`, almacen);
  }
  obtenerDetallePagoTD(almacen: AlmacenesEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoTD`, almacen);
  }

  obtenerDetallePagoGeneral(sociedadid: string, formaid: string): Observable<DetallesPago> {
    return this.http.get<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoGeneral?sociedad=`+sociedadid+`&forma=`+formaid);
  }

  obtenerDetallePagoTC(almacen: AlmacenesEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoTC`, almacen);
  }

  obtenerDetallePagoDEP(almacen: AlmacenesEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoDEP`, almacen);
  }

  obtenerDetallePagoTRF(almacen: AlmacenesEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoTRF`, almacen);
  }



  obtenerDetallePagoAlm(almacen: AlmacenesEntity, forma: FormasPagoEntity): Observable<DetallesPago> {
    return this.http.get<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoAlm?almacen=`+almacen.nombre_almacen+`&forma=`+forma.id);
  }



  obtenerDetallePagoAlmF(almacen: string, forma: string, fechadesde: string, fechahasta: string): Observable<DetallesPago> {
    return this.http.get<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoAlmF?almacen=`+almacen+`&forma=`+forma+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  obtenerDetallePagoF(sociedad: string, forma: string, fechadesde: string, fechahasta: string): Observable<DetallesPago> {
    return this.http.get<DetallesPago>(`${environment.apiUrl}detallespago/ObtenerDetallePagoF?sociedad=`+sociedad+`&forma=`+forma+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  modificarDetallePago(detalle: DetallesPagoEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/ModificarDetallePago`, detalle);
  }

  eliminarDetallePago(detalle: DetallesPagoEntity): Observable<DetallesPago> {
    return this.http.post<DetallesPago>(`${environment.apiUrl}detallespago/EliminarDetallePago`, detalle);
  }

}
