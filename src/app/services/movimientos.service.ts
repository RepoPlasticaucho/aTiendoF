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
  proveedor_id: '',
  autorizacion_venta: '',
  tercero: '',
  comp_venta: '',
  sustento_id: '',
  proveedor: '',
  sustento: '',
  tipo_comprb: '',
  total_imp: '',
  propina: '',
  importe_total: '',
  valor_rete_iva: '',
  valor_rete_renta: '',
  camp_ad1: '',
  camp_ad2: '',
  detalle_pago: '',
  updated_at: ''
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
  
  obtenerUltimoSecuencial(almacen_id: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerUltimoSecuencial?almacen_id=`+almacen_id);
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

  obtenerMovimientosAlmacenFecha(almacen: string, fechadesde: string, fechahasta: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenFecha?almacen=`+almacen+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  obtenerMovimientosCompF(almacen: string, fechadesde: string, fechahasta: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosCompF?almacen=`+almacen+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  obtenerMovimientosVentF(almacen: string, fechadesde: string, fechahasta: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosVentF?almacen=`+almacen+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  obtenerMovimientosAlmacenNombre(almacen: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenNombre?almacen=`+almacen);
  }

  obtenerMovimientosFechas(sociedad: string, fechadesde: string, fechahasta: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosFechas?sociedad=`+sociedad+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  obtenerMovimientoCLAVEACCESO(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientoCLAVEACCESO`, movimiento );
  }

  obtenerMovimientosTodos(sociedad: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosTodos?sociedad=`+sociedad);
  }

  obtenerMovimientosAlmacenFechaPAGO(almacen: string, fechadesde: string, fechahasta: string, pago: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenFechaPAGO?almacen=`+almacen+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta+`&pago=`+pago);
  }

  obtenerMovimientosAlmacenNombrePAGO(almacen: string, pago: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenNombrePAGO?almacen=`+almacen+`&pago=`+pago);
  }

  obtenerMovimientosFechasPAGO(sociedad: string, fechadesde: string, fechahasta: string, pago: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosFechasPAGO?sociedad=`+sociedad+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta+`&pago=`+pago);
  }

  obtenerMovimientosTodosPAGO(sociedad: string, pago: string): Observable<Movimientos> {
    return this.http.get<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosTodosPAGO?sociedad=`+sociedad+`&pago=`+pago);
  }

  obtenerMovimientosAlmacenv(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenV`, movimiento );
  }

  obtenerMovimientosAlmacenc(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ObtenerMovimientosAlmacenC`, movimiento );
  }

  crearXML(movimiento: string): Observable<String> {
    return this.http.get<String>(`${environment.apiUrlSome}movimientos/CrearXML?movimiento=`+movimiento );
  }

  actualizarCLAVEACCESO(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ActualizarCLAVEACCESO`, movimiento);
  }

  finalizarPedido(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/FinalizarPedido`, movimiento);
  }

  finalizarCompra(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/FinalizarCompra`, movimiento);
  }

  actualizarTerceroPedido(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ActualizarTerceroPedido`, movimiento);
  }

  actualizarClientePedido(movimiento: MovimientosEntity): Observable<Movimientos> {
    return this.http.post<Movimientos>(`${environment.apiUrl}movimientos/ActualizarClientePedido`, movimiento);
  }

}
