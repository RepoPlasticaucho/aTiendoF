import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Generos, GenerosEntity } from '../models/generos';

const initGenre: GenerosEntity = {
  id: "",
  genero: "",
  etiquetas: ""
}

@Injectable({
  providedIn: 'root'
})
export class GenerosService {

  private genre$ = new BehaviorSubject<GenerosEntity>(initGenre);

  constructor(private readonly http: HttpClient) { }

  get obtenergenero$(): Observable<GenerosEntity> {
    return this.genre$.asObservable();
  }

  asignarGenero(genero: GenerosEntity) {
    this.genre$.next(genero);
  }

  obtenerGeneros(): Observable<Generos> {
    return this.http.get<Generos>(`${environment.apiUrl}generos/ObtenerGeneros`);
  }
  agregarGenero(genero: GenerosEntity): Observable<Generos> {
    return this.http.post<Generos>(`${environment.apiUrl}generos/InsertarGeneros`, genero);
  }
  actualizarGenero(genero: GenerosEntity): Observable<Generos> {
    return this.http.post<Generos>(`${environment.apiUrl}generos/ModificarGeneros`, genero);
  }
  eliminarGenero(genero: GenerosEntity): Observable<Generos> {
    return this.http.post<Generos>(`${environment.apiUrl}generos/EliminarGeneros`, genero);
  }

}
