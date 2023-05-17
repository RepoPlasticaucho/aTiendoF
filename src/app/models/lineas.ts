export interface Lineas {
    codigoError: string;
    descripcionError: string;
    lstLineas: LineasEntity[];
}

export interface LineasEntity {
    id?: string;
    categoria_id?: string;
    categoria_nombre?: string;
    linea: string;
    etiquetas: string;
    cod_sap: string;
    almacen_id: string;
}