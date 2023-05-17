import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Lineas, LineasEntity } from '../models/lineas';
import { CategoriasEntity } from '../models/categorias';

const initLine: LineasEntity = {
  id: "",
  categoria_id: "",
  categoria_nombre: "",
  cod_sap: "",
  etiquetas: "",
  linea: "",
  almacen_id: ''
}

@Injectable({
  providedIn: 'root'
})
export class LineasService {

  private line$ = new BehaviorSubject<LineasEntity>(initLine);

  constructor(private readonly http: HttpClient) { }

  get obtenerlinea$(): Observable<LineasEntity> {
    return this.line$.asObservable();
  }
  asignarLinea(linea: LineasEntity) {
    this.line$.next(linea);
  }
  obtenerLineas(): Observable<Lineas> {
    return this.http.get<Lineas>(`${environment.apiUrl}lineas/ObtenerLineas`);
  }
  obtenerLineasCategoriaAdm(categoria: CategoriasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/ObtenerLineasCategoriaAdm`, categoria);
  }
  obtenerCategoriaLinea(categoria: CategoriasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/ObtenerCategoriaLinea`, categoria);
  }
  agregarLinea(linea: LineasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/InsertarLineas`, linea);
  }
  actualizarLinea(linea: LineasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/ModificarLineas`, linea);
  }
  eliminarLinea(linea: LineasEntity): Observable<Lineas> {
    return this.http.post<Lineas>(`${environment.apiUrl}lineas/EliminarLineas`, linea);
  }
}
