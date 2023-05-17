import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Marcas, MarcasEntity } from '../models/marcas';

const initMark: MarcasEntity = {
  id: "",
  marca: "",
  etiquetas: "",
  url_image: ""
}


@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  private marca$ = new BehaviorSubject<MarcasEntity>(initMark);

  constructor(private readonly http: HttpClient) { }

  get obtenermarca$(): Observable<MarcasEntity> {
    return this.marca$.asObservable();
  }

  asignarMarca(marca: MarcasEntity) {
    this.marca$.next(marca);
  }
  obtenerMarcas(): Observable<Marcas> {
    return this.http.get<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcas`);
  }
  agregarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/InsertarMarcas`, marca);
  }
  actualizarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ModificarMarcas`, marca);
  }
  eliminarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/EliminarMarcas`, marca);
  }
}
