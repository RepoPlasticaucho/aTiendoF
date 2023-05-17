import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Almacenes, AlmacenesEntity } from '../models/almacenes';
import { SociedadesEntity } from '../models/sociedades';

const initGruop: AlmacenesEntity = {
  idAlmacen : "",
  sociedad_id : "",
  nombresociedad: "",
  direccion : "",
  telefono : "",
  codigo : "",
  pto_emision : "",
}

@Injectable({
  providedIn: 'root'
})
export class AlmacenesService {

  private almacen$ = new BehaviorSubject<AlmacenesEntity>(initGruop);

  constructor(private readonly http: HttpClient) { }

  get obteneralmacen$(): Observable<AlmacenesEntity> {
    return this.almacen$.asObservable();
  }

  asignarAlmacen(almacen: AlmacenesEntity) {
    this.almacen$.next(almacen);
  }

  obtenerAlmacenes(): Observable<Almacenes> {
    return this.http.get<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenes`);
  }

  obtenerAlmacenesSociedad(almacen: SociedadesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenesSociedad`, almacen );
  }
  agregarAlmacen(almacen: AlmacenesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/InsertarAlmacen`, almacen);
  }

  eliminarAlmacen(almacen: AlmacenesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/EliminarAlmacen`, almacen);
  }

  actualizarAlmacen(almacen: AlmacenesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ModificarAlmacen`, almacen);
  }
}
