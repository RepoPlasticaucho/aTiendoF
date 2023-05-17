import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Colors, ColorsEntity } from '../models/colors';

const initColor: ColorsEntity = {
  id: "",
  color: "",
  cod_sap: "",
  etiquetas: ""
}

@Injectable({
  providedIn: 'root'
})
export class ColoresService {

  private color$ = new BehaviorSubject<ColorsEntity>(initColor);

  constructor(private readonly http: HttpClient) { }

  get obtenercolor$(): Observable<ColorsEntity> {
    return this.color$.asObservable();
  }

  asignarcolor(color: ColorsEntity) {
    this.color$.next(color);
  }

  obtenerColores(): Observable<Colors> {
    return this.http.get<Colors>(`${environment.apiUrl}colores/ObtenerColores`);
  }

  agregarcolor(color: ColorsEntity): Observable<Colors> {
    return this.http.post<Colors>(`${environment.apiUrl}colores/InsertarColores`, color);
  }

  actualizarcolor(color: ColorsEntity): Observable<Colors> {
    return this.http.post<Colors>(`${environment.apiUrl}colores/ModificarColores`, color);
  }

  eliminarcolor(color: ColorsEntity): Observable<Colors> {
    return this.http.post<Colors>(`${environment.apiUrl}colores/EliminarColores`, color);
  }

}
