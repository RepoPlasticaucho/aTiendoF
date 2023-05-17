export interface Atributos {
    codigoError: string;
    descripcionError: string;
    lstAtributos: AtributosEntity[];
}

export interface AtributosEntity {
    id : string;
    atributo : string;
    etiquetas: string;
}