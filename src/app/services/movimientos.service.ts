import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { MovimientosEntity, Movimientos } from '../models/movimientos';

const initMovement: MovimientosEntity = {
  id: '',
  tercero_id: '',
  tipo_id: '',
  tipo_emision_cod: '',
  estado_fact_id: '',
  tipo_comprb_id: '',
  almacen_id: '',
  estab: '',
  cod_doc: '',
  fecha_emision: '',
  secuencial: '',
  clave_acceso: '',
  total_si: '',
  total_desc: '',
  total_imp: '',
  propina: '',
  importe_total: '',
  valor_rete_iva: '',
  valor_rete_renta: '',
  camp_ad1: '',
  camp_ad2: '',
}

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  private movement$ = new BehaviorSubject<MovimientosEntity>(initMovement);

  constructor(private readonly http: HttpClient) { }

  get obtenermovimiento$(): Observable<MovimientosEntity> {
    return this.movement$.asObservable();
  }

  asignarMovimiento(movimiento: MovimientosEntity) {
    this.movement$.next(movimiento);
  }

  agregarMovimiento(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/InsertarMovimiento`, movimiento);
  }
  
  obtenerUltimoSecuencial(): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerUltimoSecuencial`);
  }

  obtenerMovimientoUno(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientoUno`, movimiento );
  }

  obtenerMovimientoID(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientoID`, movimiento );
  }

  obtenerMovimientosAlmacen(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacen`, movimiento );
  }

  obtenerMovimientosAlmacenv(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenV`, movimiento );
  }

  obtenerMovimientosAlmacenc(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenC`, movimiento );
  }

  finalizarPedido(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/FinalizarPedido`, movimiento);
  }

  actualizarTerceroPedido(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ActualizarTerceroPedido`, movimiento);
  }

  actualizarClientePedido(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ActualizarClientePedido`, movimiento);
  }

}
