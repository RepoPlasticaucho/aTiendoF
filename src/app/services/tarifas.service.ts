import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Tarifas, TarifasEntity } from '../models/tarifas';

const initTarifa: TarifasEntity = {
  id: '',
  impuesto_id: '',
  codigo: '',
  porcentaje: '',
  descripcion: '',
  tarifa_ad_valorem_e_d_2020: '',
  tarifa_esp_e_d_2020: '',
  tarifa_esp_9_mayo_diciembre_2020: '',
  created_at: '',
  updated_at: ''
}

@Injectable({
  providedIn: 'root'
})
export class TarifasService {
  private tarifa$ = new BehaviorSubject<TarifasEntity>(initTarifa);

  constructor(private readonly http: HttpClient) { }

  get obtenertarifa$(): Observable<TarifasEntity> {
    return this.tarifa$.asObservable();
  }

  asignarTarifa(tarifa: TarifasEntity) {
      this.tarifa$.next(tarifa);
  }
  
  obtenerTarifas(): Observable<Tarifas> {
      return this.http.get<Tarifas>(`${environment.apiUrl}tarifas/ObtenerTarifas`);
  }

  obtenerTarifasN(tarifa: TarifasEntity): Observable<Tarifas> {
    return this.http.post<Tarifas>(`${environment.apiUrl}tarifas/ObtenerTarifasN`, tarifa);
}
}
