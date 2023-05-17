import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Roles } from '../models/roles';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private readonly http: HttpClient) { }

  obtenerRoles(): Observable<Roles> {
    return this.http.get<Roles>(`${environment.apiUrl}roles/ObtenerRoles`);
  }

}
