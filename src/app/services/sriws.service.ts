import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SriwsService {

  constructor(private readonly http: HttpClient) { }

  recibirXMLSri(movimiento_id: string): Observable<String> {
    return this.http.get<String>(`${environment.apiUrl}sriws/RecibirXMLSri?movimiento_id=`+movimiento_id );
  }

  autorizarXMLSri(movimiento_id: string): Observable<String> {
    return this.http.get<String>(`${environment.apiUrl}sriws/AutorizarXMLSri?movimiento_id=`+movimiento_id );
  }

  enviarComprobanteCorreo(movimiento_id: string): Observable<String> {
    return this.http.get<String>(`${environment.apiUrl}sriws/EnviarComprobanteCorreo?movimiento_id=`+movimiento_id );
  }

  /*
  crearATS(sociedad: string, fechaDesde: string, fechaHasta: string): Observable<String> {
    return this.http.get<String>(`${environment.apiUrl}sriws/CrearATS?sociedad=`+movimiento );
  }
  */
}
