import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Provincias, ProvinciasEntity } from "../models/provincias";

const initGruop: ProvinciasEntity = {
    id : '',
    provincia: '',
    codigo: '',
    created_at : '',
    update_at : '',
}

@Injectable({
    providedIn: 'root'
})

export class ProvinciasService {

    private provincia$ = new BehaviorSubject<ProvinciasEntity>(initGruop);

    constructor(private readonly http: HttpClient) { }
  
    get obtenerpronvincia$(): Observable<ProvinciasEntity> {
      return this.provincia$.asObservable();
    }

    asignarProvincia(provincia: ProvinciasEntity) {
        this.provincia$.next(provincia);
    }
    
    obtenerProvincias(): Observable<Provincias> {
        return this.http.get<Provincias>(`${environment.apiUrl}provincias/ObtenerProvincias`);
    }
}