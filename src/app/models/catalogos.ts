export interface Catalogos {
    length: number;
    filter(arg0: (n: any, i: any) => boolean): unknown;
    indexOf(n: any): unknown;
    codigoError: string;
    descripcionError: string;
    lstCatalogos: CatalogosEntity[];
}

export interface CatalogosEntity {
   
    id: string;
    codigo : string;
    material : string;
    talla : string;
    subfamilia : string;
    familia : string;
    marcaid ?: string;
    marca : string;
    tipo : string;
    tipoid ?:string;
    producto : string;
    productoid ?:string;
    color : string;
    colorid ?: string;
    caracteristica : string;
    caracteristicaid? : string;
    genero : string;
    generoid? : string;
    categoria : string;
    categoriaid? : string;
    moelo_producto : string;
    modelo_producto_id : string;
    linea_producto_id : string;
    costo? : string;
    pvp? : string
    unidad_medidad? : string;
    tarifa_ice_iva_id?: string
}