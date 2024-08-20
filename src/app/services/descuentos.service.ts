import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Descuentos, DescuentosEntity } from '../models/descuentos';
import { SociedadesEntity } from '../models/sociedades';
import { MovimientosEntity } from '../models/movimientos';


@Injectable({
    providedIn: 'root'
})
export class DescuentosService {

    constructor(private readonly http: HttpClient) { }

    private descuentosSubject = new BehaviorSubject<DescuentosEntity[]>([]);
  
    // Observable para que otros componentes puedan suscribirse
    descuentos$ = this.descuentosSubject.asObservable();
  
    // Método para actualizar los descuentos
    updateDescuentos(descuentos: DescuentosEntity[]) {
      this.descuentosSubject.next(descuentos);
    }
  
    // Método para obtener los descuentos actuales (opcional)
    getDescuentos(): DescuentosEntity[] {
      return this.descuentosSubject.getValue();
    }
    agregarDescuento(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/InsertarDescuento`, descuento);
    }
    obtenerDescuentos(sociedad: SociedadesEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/ObtenerDescuentosSociedad`, sociedad);
    }

    desactivarDescuento(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/DesactivarDescuento`, descuento);
    }

    activarDescuento(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/ActivarDescuento`, descuento);
    }

    eliminarDescuento(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/EliminarDescuento`, descuento);
    }

    eliminarDescuentoID(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/EliminarDescuentoID`, descuento);
    }

    aplicarDescuento(descuento: DescuentosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/AplicarDescuento`, descuento);
    }

    obtenerDescuentosAplicados(movimiento: MovimientosEntity): Observable<Descuentos> {
        return this.http.post<Descuentos>(`${environment.apiUrl}descuentos/ObtenerDescuentosAplicados`, movimiento);
    }
    



    //   actualizarcolor(color: ColorsEntity): Observable<Colors> {
    //     return this.http.post<Colors>(`${environment.apiUrl}colores/ModificarColores`, color);
    //   }

    //   eliminarcolor(color: ColorsEntity): Observable<Colors> {
    //     return this.http.post<Colors>(`${environment.apiUrl}colores/EliminarColores`, color);
    //   }

}
