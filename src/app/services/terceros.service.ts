import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Terceros, TercerosEntity } from '../models/terceros';


const initGruop: TercerosEntity = {
  id: "",
  almacen_id: "",
  sociedad_id: "",
  tipotercero_id: "",
  tipousuario_id: "",
  nombresociedad: "",
  nombrealmacen: "",
  nombretercero: "",
  tipousuario: "",
  nombre: "",
  id_fiscal: "",
  direccion: "",
  telefono: "",
  correo: "",
  fecha_nac: "",
  ciudad: '',
  provincia: '',
  ciudadid: ''
}


@Injectable({
  providedIn: 'root'
})
export class TercerosService {

  private db: any;

  private tercero$ = new BehaviorSubject<TercerosEntity>(initGruop);

  constructor(private readonly http: HttpClient) { }

  get obtenertercero$(): Observable<TercerosEntity> {
    return this.tercero$.asObservable();
  }

  asignarTercero(tercero: TercerosEntity) {
    this.tercero$.next(tercero);
  }

  obtenerTercerosAll(): Observable<Terceros> {
    return this.http.get<Terceros>(`${environment.apiUrl}terceros/ObtenerTercerosAll`);
  }

  obtenerTerceros(tercero: TercerosEntity): Observable<Terceros> {
    return this.http.post<Terceros>(`${environment.apiUrl}terceros/ObtenerTerceros`, tercero );
  }
  
  agregarTerceros(tercero: TercerosEntity): Observable<Terceros> {
    return this.http.post<Terceros>(`${environment.apiUrl}terceros/InsertarTercero`, tercero);
  }

  eliminarTerceros(tercero: TercerosEntity): Observable<Terceros> {
    return this.http.post<Terceros>(`${environment.apiUrl}terceros/EliminarTerceros`, tercero);
  }

  actualizarTerceros(tercero: TercerosEntity): Observable<Terceros> {
    return this.http.post<Terceros>(`${environment.apiUrl}terceros/ModificarTerceros`, tercero);
  }

  agregarCategoriaBDD=(tercero: TercerosEntity) =>{
    tercero.id=new Date().toISOString();
    this.db.get(tercero.id)
      .then((doc: any) => {
        delete tercero.id;
        doc = Object.assign(doc, tercero);
        console.log(doc);
        this.db.put(doc);
      }).catch(() => {
        this.db.put(tercero);
      });
  }
  
}
