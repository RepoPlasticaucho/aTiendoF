export interface Modelos {
    codigoError: string;
    descripcionError: string;
    lstModelos: ModelosEntity[];
}

export interface ModelosEntity {
    id?: string;
    linea_id: string;
    almacen_id?: string;
    linea_nombre?: string;
    modelo: string;
    etiquetas: string;
    cod_sap: string;
}