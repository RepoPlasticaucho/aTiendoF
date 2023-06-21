import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Tipocomprobante, TipocomprobanteEntity } from '../models/tipo_comprobante'

const initFact: TipocomprobanteEntity = {
  id: '',
  nombre: '',
  codigo: '',
  created_at: '',
  update_at: ''
}

@Injectable({
  providedIn: 'root'
})

export class TipocomprobanteService {
  private tipocomprobante$ = new BehaviorSubject<TipocomprobanteEntity>(initFact);

  constructor(private readonly http: HttpClient) { }

  get obtenertipocomprobante$(): Observable<TipocomprobanteEntity> {
    return this.tipocomprobante$.asObservable();
  }

  asignarTipocomprobante(tipocomprobante: TipocomprobanteEntity) {
      this.tipocomprobante$.next(tipocomprobante);
  }
  
  obtenerTipos(): Observable<Tipocomprobante> {
      return this.http.get<Tipocomprobante>(`${environment.apiUrl}tipo_comprobante/ObtenerTipos`);
  }

  obtenerTipoN(nombre: TipocomprobanteEntity):Observable<Tipocomprobante>{
    return this.http.post<Tipocomprobante>(`${environment.apiUrl}tipo_comprobante/ObtenerTipoN`, nombre);
}
}
