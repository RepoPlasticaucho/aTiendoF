import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Sociedades, SociedadesEntity } from '../models/sociedades';

const initCorporation: SociedadesEntity = {
  idGrupo: "",
  email: "",
  nombre_comercial: "",
  id_fiscal: "",
  telefono: "",
  password: "",
  funcion: '',
  idSociedad: '',
  razon_social: ''
}

@Injectable({
  providedIn: 'root'
})
export class SociedadesService {

  private sociedad$ = new BehaviorSubject<SociedadesEntity>(initCorporation);

  constructor(private readonly http: HttpClient) { }

  get obtenersociedad$(): Observable<SociedadesEntity> {
    return this.sociedad$.asObservable();
  }

  asignarSociedad(sociedad: SociedadesEntity) {
    this.sociedad$.next(sociedad);
  }
  agregarSociedad(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/InsertarSociedad`, sociedad);
  }
  obtenerSociedades(): Observable<Sociedades> {
    return this.http.get<Sociedades>(`${environment.apiUrl}sociedades/ObtenerSociedades`);
  }
  eliminarSociedad(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/EliminarSociedad`, sociedad);
  }
  actualizarSociedad(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ModificarSociedad`, sociedad);
  }
  actualSociedad(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ActualizarSociedad`, sociedad);
  }
  actualizarPass(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ActualizarPass`, sociedad);
  }
  obtenerSociedadL(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ObtenerSociedad`, sociedad);
  }
  obtenerUsuario(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ObtenerUsuario`, sociedad);
  }
  obtenerUser(sociedad: SociedadesEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ObtenerUser`, sociedad);
  }
  obtenerSociedadesN(nombre: SociedadesEntity):Observable<Sociedades>{
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/ObtenerSociedadesN`, nombre);
  }
}
