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
    marca : string;
    tipo : string;
    producto : string;
    color : string;
    caracteristica : string;
    genero : string;
    categoria : string;
    moelo_producto : string;
    modelo_producto_id : string;
    linea_producto_id : string;
}