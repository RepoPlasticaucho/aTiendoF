import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Categorias, CategoriasEntity } from '../models/categorias';

const initCategory: CategoriasEntity = {
  id: "",
  categoria: "",
  cod_sap: "",
  etiquetas: "",
  almacen_id: ''
}

@Injectable({
  providedIn: 'root'
})

export class CategoriasService {

  private category$ = new BehaviorSubject<CategoriasEntity>(initCategory);
  private db: any;

  constructor(private readonly http: HttpClient) {
    const PouchDB = require('pouchdb-browser');
    const pouchDB = PouchDB.default.defaults();
    this.db = new pouchDB('BDDCategorias');
  }

  get obtenercategoria$(): Observable<CategoriasEntity> {
    return this.category$.asObservable();
  }
  asignarCategoria(categoria: CategoriasEntity) {
    this.category$.next(categoria);
  }
  obtenerCategorias(): Observable<Categorias> {
    return this.http.get<Categorias>(`${environment.apiUrl}categorias/ObtenerCategorias`);
  }
  agregarCategoria(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}categorias/InsertarCategorias`, categoria);
  }
  eliminarCategoria(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}categorias/EliminarCategorias`, categoria);
  }
  actualizarCategoria(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}categorias/ModificarCategorias`, categoria);
  }
  obtenerCategoriaNombre(categoria: CategoriasEntity): Observable<Categorias> {
    return this.http.post<Categorias>(`${environment.apiUrl}almacenes/ObtenerCategoriaNombre`, categoria );
  }
  agregarCategoriaBDD=(categoria: CategoriasEntity) =>{
    categoria._id=new Date().toISOString();
    this.db.get(categoria._id)
      .then((doc: any) => {
        delete categoria._id;
        doc = Object.assign(doc, categoria);
        console.log(doc);
        this.db.put(doc);
      }).catch(() => {
        this.db.put(categoria);
      });
  }

  
}
