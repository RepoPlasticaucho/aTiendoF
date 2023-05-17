import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Tipoterceros, TipotercerosEntity } from '../models/tipotercero';

const initGruop: TipotercerosEntity = {
    idTipo_tercero : '',
    descripcion: '',
    codigo: '',
    created_at: '',
    update_at: '',
    
}

@Injectable({
    providedIn: 'root'
})

export class TipotercerosService {

    private tipotercero$ = new BehaviorSubject<TipotercerosEntity>(initGruop);

    constructor(private readonly http: HttpClient) { }
  
    get obtenertipotercero$(): Observable<TipotercerosEntity> {
      return this.tipotercero$.asObservable();
    }

    asignarTipotercero(tipotercero: TipotercerosEntity) {
        this.tipotercero$.next(tipotercero);
    }
    
    obtenerTipoterceros(): Observable<Tipoterceros> {
        return this.http.get<Tipoterceros>(`${environment.apiUrl}tipo_tercero/ObtenerTipo_Tercero`);
    }

    obtenerTipoTercerosN(descripcion: TipotercerosEntity):Observable<Tipoterceros>{
        return this.http.post<Tipoterceros>(`${environment.apiUrl}tipo_tercero/ObtenerTipo_TerceroN`, descripcion);
    }
}