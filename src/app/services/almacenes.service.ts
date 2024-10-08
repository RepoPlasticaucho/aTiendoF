import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Almacenes, AlmacenesEntity } from '../models/almacenes';
import { SociedadesEntity } from '../models/sociedades';
import { Productossociedad } from '../models/productossociedad';

const initGruop: AlmacenesEntity = {
  idAlmacen : "",
  sociedad_id : "",
  nombre_almacen: "",
  nombresociedad: "",
  direccion : "",
  idfiscal_sociedad: '',
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

  obtenerAlmacenId(almacen: AlmacenesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenId`,almacen);
  }

  obtenerAlmacenesSociedad(almacen: SociedadesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenesSociedad`, almacen );
  }
  obtenerAlmacenesEsp(almacen: AlmacenesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenesEsp`, almacen );
  }
  obtenerAlmacenID(almacen: AlmacenesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenID`, almacen );
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

  obtenerAlmacenesS(almacen: SociedadesEntity): Observable<Almacenes> {
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenesS`, almacen);
  }
  obtenerAlmacenN(nombre_almacen: AlmacenesEntity):Observable<Almacenes>{
    return this.http.post<Almacenes>(`${environment.apiUrl}almacenes/ObtenerAlmacenN`, nombre_almacen);
  }
  
  obtenerProductoSociedadCosto(so: SociedadesEntity): Observable<Productossociedad> {
    return this.http.post<Productossociedad>(`${environment.apiUrl}productos/ProductoSociedadCostos`, so);
  }
}
