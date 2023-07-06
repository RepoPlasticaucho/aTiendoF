import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { ProveedoresEntity, Proveedores } from '../models/proveedores';

const initProv: ProveedoresEntity = {
  id: '',
  id_fiscal: '',
  ciudadid: '',
  correo: '',
  direccionprov: '',
  nombre: '',
  telefono: ''
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private db: any;

  private proveedor$ = new BehaviorSubject<ProveedoresEntity>(initProv);

  constructor(private readonly http: HttpClient) { }

  get obtenerproveedor$(): Observable<ProveedoresEntity> {
    return this.proveedor$.asObservable();
  }

  asignarProveedor(proveedor: ProveedoresEntity) {
    this.proveedor$.next(proveedor);
  }

  obtenerProveedores(): Observable<Proveedores> {
    return this.http.get<Proveedores>(`${environment.apiUrl}proveedores/ObtenerProveedores`);
  }

  obtenerProveedoresAll(): Observable<Proveedores> {
    return this.http.get<Proveedores>(`${environment.apiUrl}proveedores/ObtenerProveedoresAll`);
  }

  obtenerProveedoresN(proveedor: ProveedoresEntity): Observable<Proveedores> {
    return this.http.post<Proveedores>(`${environment.apiUrl}proveedores/ObtenerProveedoresN`, proveedor);
  }
  agregarProveedores(proveedor: ProveedoresEntity): Observable<Proveedores> {
    return this.http.post<Proveedores>(`${environment.apiUrl}proveedores/InsertarProveedores`, proveedor);
  }
  actualizarProveedores(proveedor: ProveedoresEntity): Observable<Proveedores> {
    return this.http.post<Proveedores>(`${environment.apiUrl}proveedores/ModificarProveedores`, proveedor);
  }
  eliminarProveedor(proveedor: ProveedoresEntity): Observable<Proveedores> {
    return this.http.post<Proveedores>(`${environment.apiUrl}proveedores/EliminarProveedor`, proveedor);
  }
}
