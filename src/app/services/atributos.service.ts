import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Atributos, AtributosEntity } from '../models/atributos';

const initAttribute: AtributosEntity = {
  id: "",
  atributo: "",
  etiquetas: ""
}

@Injectable({
  providedIn: 'root'
})
export class AtributosService {

  private attribute$ = new BehaviorSubject<AtributosEntity>(initAttribute);

  constructor(private readonly http: HttpClient) { }

  get obteneratributo$(): Observable<AtributosEntity> {
    return this.attribute$.asObservable();
  }

  asignarAtributo(atributo: AtributosEntity) {
    this.attribute$.next(atributo);
  }

  obtenerAtributos(): Observable<Atributos> {
    return this.http.get<Atributos>(`${environment.apiUrl}atributos/ObtenerAtributos`);
  }

  agregarAtributo(atributo: AtributosEntity): Observable<Atributos> {
    return this.http.post<Atributos>(`${environment.apiUrl}atributos/InsertarAtributos`, atributo);
  }

  actualizarAtributo(atributo: AtributosEntity): Observable<Atributos> {
    return this.http.post<Atributos>(`${environment.apiUrl}atributos/ModificarAtributos`, atributo);
  }

  eliminarAtributo(atributo: AtributosEntity): Observable<Atributos> {
    return this.http.post<Atributos>(`${environment.apiUrl}atributos/EliminarAtributos`, atributo);
  }

}
