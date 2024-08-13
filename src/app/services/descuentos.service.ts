import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Descuentos, DescuentosEntity } from '../models/descuentos';
import { SociedadesEntity } from '../models/sociedades';


@Injectable({
    providedIn: 'root'
})
export class DescuentosService {

    constructor(private readonly http: HttpClient) { }


    agregarDescuento(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/InsertarDescuento`, descuento);
    }
    obtenerDescuentos(sociedad: SociedadesEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/ObtenerDescuentosSociedad`, sociedad);
      }
    

    //   actualizarcolor(color: ColorsEntity): Observable<Colors> {
    //     return this.http.post<Colors>(`${environment.apiUrl}colores/ModificarColores`, color);
    //   }

    //   eliminarcolor(color: ColorsEntity): Observable<Colors> {
    //     return this.http.post<Colors>(`${environment.apiUrl}colores/EliminarColores`, color);
    //   }

}
