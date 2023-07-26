import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Marcas, MarcasEntity } from '../models/marcas';
import { CategoriasEntity } from '../models/categorias';
import { Proveedores, ProveedoresEntity } from '../models/proveedores';
import { ModelosEntity } from '../models/modelos';
import { LineasEntity } from '../models/lineas';

const initMark: MarcasEntity = {
  id: "",
  marca: "",
  etiquetas: "",
  proveedor: "",
  proveedor_id: "",
  url_image: ""
}


@Injectable({
  providedIn: 'root'
})
export class MarcasService {

  private marca$ = new BehaviorSubject<MarcasEntity>(initMark);

  constructor(private readonly http: HttpClient) { }

  get obtenermarca$(): Observable<MarcasEntity> {
    return this.marca$.asObservable();
  }

  asignarMarca(marca: MarcasEntity) {
    this.marca$.next(marca);
  }
  obtenerMarcas(): Observable<Marcas> {
    return this.http.get<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcas`);
  }
  obtenerMarcaCategoria(categoria: CategoriasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcaCategoria`, categoria);
  }
  obtenerMarcaModelo(modelo: ModelosEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcaModelo`, modelo);
  }
  obtenerMarcaLinea(linea: LineasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcaLinea`, linea);
  }
  obtenerMarcasProveedor(proveedor: ProveedoresEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ObtenerMarcasProveedor`, proveedor);
  }
  agregarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/InsertarMarcas`, marca);
  }
  actualizarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/ModificarMarcas`, marca);
  }
  eliminarMarca(marca: MarcasEntity): Observable<Marcas> {
    return this.http.post<Marcas>(`${environment.apiUrl}marcas/EliminarMarcas`, marca);
  }
}
