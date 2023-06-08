import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PortafoliosM, PortafoliosEntity } from '../models/portafoliosm';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Inventarios, InventariosEntity } from '../models/inventarios';

const initGruop: PortafoliosEntity = {
  id: '',
  cod_sap: '',
  sociedadid: '',
  cliente : '',
  almacen : '',
  almacenid : '',
  dir_almacen : '',
  material_sap : '',
  materialid : '',
  costo: '',
  pvp1 : '',
  pvp_sugerido : '',
  stock : '',
  materialnombre:''
}

@Injectable({
  providedIn: 'root'
})

export class PortafoliosMService {

  private catalogo$ = new BehaviorSubject<PortafoliosEntity>(initGruop);

  constructor(private readonly http: HttpClient) { }
  
  get ObtenerPortafolios$(): Observable<PortafoliosEntity> {
    return this.catalogo$.asObservable();
  }

  asignarPortafolioM(catalogo: PortafoliosEntity) {
    this.catalogo$.next(catalogo);
  }
      
  ObtenerPortafolioM(): Observable<PortafoliosM> {
    return this.http.get<PortafoliosM>(`${environment.apiUrl}portafolios/ObtenerPortafolios`);
  }

  obtenerPortafoliosInventarios(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ObtenerPortafoliosInventarios`,inventario );
  }

  agregarInventario(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/InsertarInventarios`, inventario);
  }
    
  actualizarInventarios(inventario: InventariosEntity): Observable<Inventarios> {
    return this.http.post<Inventarios>(`${environment.apiUrl}inventarios/ActualizarInventarios`, inventario);
  }
}