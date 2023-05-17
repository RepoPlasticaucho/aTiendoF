export interface Generos {
    codigoError: string;
    descripcionError: string;
    lstGeneros: GenerosEntity[];
}

export interface GenerosEntity {
    id : string;
    genero : string;
    etiquetas: string;
}