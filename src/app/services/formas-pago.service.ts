import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { FormasPago, FormasPagoEntity } from '../models/formas-pago';

const initForm: FormasPagoEntity = {
  id: '',
  nombre: '',
  codigo: '',
  fecha_inicio: '',
  fecha_fin: '',
  created_at: '',
  updated_at: ''
}

@Injectable({
  providedIn: 'root'
})
export class FormasPagoService {
  private form$ = new BehaviorSubject<FormasPagoEntity>(initForm);

  constructor(private readonly http: HttpClient) { }

  get obtenerforma$(): Observable<FormasPagoEntity> {
    return this.form$.asObservable();
  }

  asignarForma(formaPago: FormasPagoEntity) {
    this.form$.next(formaPago);
  }

  obtenerFormasPago(): Observable<FormasPago> {
    return this.http.get<FormasPago>(`${environment.apiUrl}formaspago/ObtenerFormasPago`);
  }

  obtenerFormasPagoN(forma: FormasPagoEntity): Observable<FormasPago> {
    return this.http.post<FormasPago>(`${environment.apiUrl}formaspago/ObtenerFormasPagoN`, forma);
  }
}
