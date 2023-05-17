export interface Colors {
    codigoError: string;
    descripcionError: string;
    lstColors: ColorsEntity[];
}

export interface ColorsEntity {
    id: string;
    color: string;
    cod_sap: string;
    etiquetas: string;
}