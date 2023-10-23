import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { SustentosTributarios, SustentosTributariosEntity } from '../models/sustentos_tributarios';

const initSustento: SustentosTributariosEntity = {
  id: '',
  etiquetas: '',
  codigo: '',
  sustento: ''
}

@Injectable({
  providedIn: 'root'
})
export class SustentosTributariosService {

  private sustento$ = new BehaviorSubject<SustentosTributariosEntity>(initSustento);

  constructor(private readonly http: HttpClient) { }

  get obtenersustento$(): Observable<SustentosTributariosEntity> {
    return this.sustento$.asObservable();
  }

  asignarSustento(sustento: SustentosTributariosEntity) {
    this.sustento$.next(sustento);
  }
  obtenerSustentos(): Observable<SustentosTributarios> {
    return this.http.get<SustentosTributarios>(`${environment.apiUrl}sustentos_tributarios/ObtenerSustentos`);
  }

  obtenerSustentosN(sustento: SustentosTributariosEntity):Observable<SustentosTributarios>{
    return this.http.post<SustentosTributarios>(`${environment.apiUrl}sustentos_tributarios/ObtenerSustentosN`, sustento);
  }
  obtenerSustentosComp(sustento: SustentosTributariosEntity):Observable<SustentosTributarios>{
    return this.http.post<SustentosTributarios>(`${environment.apiUrl}sustentos_tributarios/ObtenerSustentosComp`, sustento);
  }
}
