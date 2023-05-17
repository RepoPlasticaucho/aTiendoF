import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Ciudades, CiudadesEntity } from '../models/ciudades';
import { ProvinciasEntity } from '../models/provincias';

const initGruop: CiudadesEntity = {
    idCiudad: '',
    provincia: '',
    codigo: '',
    created_at: '',
    update_at: '',
    ciudad: '',
    provinciaid: ''
}

@Injectable({
    providedIn: 'root'
})

export class CiudadesService {

    private ciudad$ = new BehaviorSubject<CiudadesEntity>(initGruop);

    constructor(private readonly http: HttpClient) { }

    get obtenerciudad$(): Observable<CiudadesEntity> {
        return this.ciudad$.asObservable();
    }
  
    asignarCiudad(ciudad: CiudadesEntity) {
        this.ciudad$.next(ciudad);
    }
    
    obtenerCiudadesAll(): Observable<Ciudades> {
        return this.http.get<Ciudades>(`${environment.apiUrl}ciudades/ObtenerCiudadesAll`);
    }

    obtenerCiudades(ciudad: ProvinciasEntity): Observable<Ciudades> {
        return this.http.post<Ciudades>(`${environment.apiUrl}ciudades/ObtenerCiudades`, ciudad);
    }
    obtenerCiudadesN(ciudad: ProvinciasEntity): Observable<Ciudades> {
        return this.http.post<Ciudades>(`${environment.apiUrl}ciudades/ObtenerCiudadesN`, ciudad);
    }
}

