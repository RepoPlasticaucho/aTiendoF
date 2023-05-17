import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ImagenesEntity } from '../models/imagenes';

@Injectable({
    providedIn: 'root'
})
export class ImagenesService {

    constructor(private readonly http: HttpClient) { }

    agregarImagen(image: ImagenesEntity): Observable<ImagenesEntity> {
        return this.http.post<ImagenesEntity>(`${environment.apiUrl}adicionales/ProcesarImagenMarca`, image);
    }

    agregarImagenMP(image: ImagenesEntity): Observable<ImagenesEntity> {
        return this.http.post<ImagenesEntity>(`${environment.apiUrl}adicionales/ProcesarImagenModeloProducto`, image);
    }

}
