import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Grupos, GruposEntity } from '../models/grupos';

const initGruop: GruposEntity = {
  id: "",
  grupo: "",
  idFiscal: ""
}

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private grupo$ = new BehaviorSubject<GruposEntity>(initGruop);

  constructor(private readonly http: HttpClient) { }

  get obtenergrupo$(): Observable<GruposEntity> {
    return this.grupo$.asObservable();
  }
  asignarGrupo(grupo: GruposEntity) {
    this.grupo$.next(grupo);
  }
  obtenerGrupos(): Observable<Grupos> {
    return this.http.get<Grupos>(`${environment.apiUrl}grupos/ObtenerGrupos`);
  }
  agregarGrupo(grupo: GruposEntity): Observable<Grupos> {
    return this.http.post<Grupos>(`${environment.apiUrl}grupos/InsertarGrupo`, grupo);
  }
  eliminarGrupo(grupo: GruposEntity): Observable<Grupos> {
    return this.http.post<Grupos>(`${environment.apiUrl}grupos/EliminarGrupo`, grupo);
  }
  actualizarGrupo(grupo: GruposEntity): Observable<Grupos> {
    return this.http.post<Grupos>(`${environment.apiUrl}grupos/ModificarGrupo`, grupo);
  }
}
