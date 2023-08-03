import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { DetallesMovimiento, DetallesMovimientoEntity } from '../models/detallesmovimiento';
import { SociedadesEntity } from '../models/sociedades';
import { AlmacenesEntity } from '../models/almacenes';

const initDetail: DetallesMovimientoEntity = {
  id: '',
  producto_id: '',
  producto_nombre: '',
  inventario_id: '',
  pto_emision: '',
  tarifa: '',
  movimiento_id: '',
  cantidad: '',
  desc_add: '',
  costo: '',
  precio: '',
  color: '',
  modelo_producto_nombre: '',
  tamanio: '',
  unidad_medida: '',
  url_image: '',
  created_at: '',
  cod_tarifa: '',
  tipo_movimiento: ''
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
  
  obtenerDetalleMovimiento(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerDetalleMovimiento`, detalle );
  }

  obtenerUltDetalleMovimiento(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerUltDetalleMovimiento`, detalle );
  }

  obtenerDetalleMovimientoSociedad(sociedad: SociedadesEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerDetalleMovimientoSociedad`, sociedad );
  }

  obtenerDetalleMovimientoAlm(almacen: AlmacenesEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerDetalleMovimientoAlm`, almacen );
  }

  obtenerDetalleMovimientoAlmF(almacen: string, fechadesde: string, fechahasta: string): Observable<DetallesMovimiento> {
    return this.http.get<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerDetalleMovimientoAlmF?almacen=`+almacen+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta);
  }

  obtenerDetalleMovimientoAlmFTipo(almacen: string, fechadesde: string, fechahasta: string, tipo: string): Observable<DetallesMovimiento> {
    return this.http.get<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerDetalleMovimientoAlmFTipo?almacen=`+almacen+`&fechadesde=`+fechadesde+`&fechahasta=`+fechahasta+`&tipo=`+tipo);
  }

  obtenerDetalleMovimientoAlmTipo(almacen: string, tipo: string): Observable<DetallesMovimiento> {
    return this.http.get<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ObtenerDetalleMovimientoAlmTipo?almacen=`+almacen+`&tipo=`+tipo);
  }

  agregarDetallePedido(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/InsertarDetallePedido`, detalle);
  }

  agregarDetalleCompras(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/InsertarDetalleCompras`, detalle);
  }

  agregarDetalleCompra(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/InsertarDetalleCompra`, detalle);
  }

  modificarDetallePedido(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ModificarDetallePedido`, detalle);
  }

  modificarDetalleCompra(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/ModificarDetalleCompra`, detalle);
  }

  eliminarDetallePedido(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/EliminarDetalleMovimiento`, detalle);
  }

  eliminarDetalleCompra(detalle: DetallesMovimientoEntity): Observable<DetallesMovimiento> {
    return this.http.post<DetallesMovimiento>(`${environment.apiUrl}detallesmovimiento/EliminarDetalleCompra`, detalle);
  }
}
