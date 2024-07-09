import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { FormasPagoSociedad, FormasPagoSociedadEntity } from '../models/formas-pago-sociedad';
import { SociedadesEntity } from '../models/sociedades';

const initForm: FormasPagoSociedadEntity = {
  id: '',
  nombreFormaPago: '',
    forma_pago_id: '',
    sociedad_id: '',
}

@Injectable({
  providedIn: 'root'
})
export class FormasPagoServiceSociedad {
 
  constructor(private readonly http: HttpClient) { }

  obtenerFormasPago(sociedad: SociedadesEntity): Observable<FormasPagoSociedad> {
    return this.http.post<FormasPagoSociedad>(`${environment.apiUrl}pagossociedades/PagosSociedad`, sociedad);
  }

  insertarFormaSociedad(idFormaPago: string, idSociedad: string): Observable<FormasPagoSociedadEntity> {
 

    const formaPagoSociedad: FormasPagoSociedadEntity = {
      ...initForm,
      forma_pago_id: idFormaPago,
      sociedad_id: idSociedad,
    }

    return this.http.post<FormasPagoSociedadEntity>(`${environment.apiUrl}pagossociedades/InsertarFormaPagoSociedad`, formaPagoSociedad);
  }


  eliminarFormaSociedad(idFormaPago: string, idSociedad: string): Observable<FormasPagoSociedadEntity> {
    const formaPagoSociedad: FormasPagoSociedadEntity = {
      ...initForm,
      forma_pago_id: idFormaPago,
      sociedad_id: idSociedad,
    }

    return this.http.post<FormasPagoSociedadEntity>(`${environment.apiUrl}pagossociedades/EliminarFormaPagoSociedad`, formaPagoSociedad);
  }

}
