import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Tipousuarios, TipousuariosEntity } from '../models/tipousuario';

const initGruop: TipousuariosEntity = {
    idTipo_Usuario : '',
    usuario: ''
    
}

@Injectable({
    providedIn: 'root'
})

export class TipousuariosService {

    private tipousuario$ = new BehaviorSubject<TipousuariosEntity>(initGruop);

    constructor(private readonly http: HttpClient) { }
  
    get obtenerpronvincia$(): Observable<TipousuariosEntity> {
      return this.tipousuario$.asObservable();
    }

    asignarTipousuario(tipousuario: TipousuariosEntity) {
        this.tipousuario$.next(tipousuario);
    }
    
    obtenerTipousuarios(): Observable<Tipousuarios> {
        return this.http.get<Tipousuarios>(`${environment.apiUrl}tipo_usuario/ObtenerTipo_Usuario`);
    }

    obtenerTipoUsuariosN(usuario: TipousuariosEntity):Observable<Tipousuarios>{
        return this.http.post<Tipousuarios>(`${environment.apiUrl}tipo_usuario/ObtenerTipo_UsuarioN`, usuario);
    }
}