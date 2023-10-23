import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ComprobanteCompras, ComprobanteComprasEntity } from '../models/comprobante_compras';

const initComprobante: ComprobanteComprasEntity = {
  id: '',
  tipo: '',
  codigo: ''
}

@Injectable({
  providedIn: 'root'
})
export class ComprobanteComprasService {
  private comprobante$ = new BehaviorSubject<ComprobanteComprasEntity>(initComprobante);

  constructor(private readonly http: HttpClient) { }

  get obtenercomprobante$(): Observable<ComprobanteComprasEntity> {
    return this.comprobante$.asObservable();
  }

  asignarComprobante(comprobante: ComprobanteComprasEntity) {
    this.comprobante$.next(comprobante);
  }
  obtenerComprobantes(): Observable<ComprobanteCompras> {
    return this.http.get<ComprobanteCompras>(`${environment.apiUrl}comprobante_compras/ObtenerComprobantes`);
  }
  obtenerComprobantesN(comprobante: ComprobanteComprasEntity):Observable<ComprobanteCompras>{
    return this.http.post<ComprobanteCompras>(`${environment.apiUrl}comprobante_compras/ObtenerComprobantesN`, comprobante);
  }
}
