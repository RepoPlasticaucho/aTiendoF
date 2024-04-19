import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Sociedades, SociedadesEntity } from '../models/sociedades';
import { PersonalEntity } from '../models/personal';

const initCorporation: PersonalEntity = {
  idSociedad: '',
  idGrupo: '',
  nombreGrupo: '',
  razon_social: '',
  nombre_comercial: '',
  id_fiscal: '',
  id_fiscal_grupo: '',
  email: '',
  telefono: '',
  password: '',
  funcion: '',
  tipo_ambienteid: '',
  url_certificado: '',
  clave_certificado: '',
  dir1: '',
  direccion: '',
  ambiente: '',
  email_certificado: '',
  pass_certificado: '',
  nombre_personal: '',
  sociedad_pertenece: ''
}



@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  private personal$ = new BehaviorSubject<PersonalEntity>(initCorporation);

  constructor(private readonly http: HttpClient) { }

 // get obtenersociedad$(): Observable<SociedadesEntity> {
   // return this.sociedad$.asObservable();
 // }

  agregarPersonal(personal: PersonalEntity): Observable<Sociedades> {
    return this.http.post<Sociedades>(`${environment.apiUrl}sociedades/InsertarSociedadPersonal`, personal);
  }

}
