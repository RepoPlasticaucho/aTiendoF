import { Injectable } from "@angular/core";
import { ProductosCompra, ProductosCompraEntity } from "../models/productocompras";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

const initGruop: ProductosCompraEntity = {
    id: "",
    cliente: "",
    producto: "",
    nombre_producto: "",
    nombre_prove: "",
    precio: "",
    created_at: "",
    update_at: "",
    clienteid: "",
    productoid: "",
    proveedorid: ""
}
  
  @Injectable({
    providedIn: 'root'
  })
  
  export class ProductoComprasService {
  
    private catalogo$ = new BehaviorSubject<ProductosCompraEntity>(initGruop);
  
    constructor(private readonly http: HttpClient) { }
    
    get ObtenerProductosCompras$(): Observable<ProductosCompraEntity> {
      return this.catalogo$.asObservable();
    }
  
    asignarProductoCompras(catalogo: ProductosCompraEntity) {
      this.catalogo$.next(catalogo);
    }
    
    ObtenerProductosCompras(): Observable<ProductosCompra> {
        return this.http.get<ProductosCompra>(`${environment.apiUrl}productocompra/ObtenerProducto_Compra`);
    }
}