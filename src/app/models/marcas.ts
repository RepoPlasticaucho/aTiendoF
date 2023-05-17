export interface Marcas {
    codigoError: string;
    descripcionError: string;
    lstMarcas: MarcasEntity[];
}

export interface MarcasEntity {
    id: string;
    marca: string;
    etiquetas: string;
    url_image: string;
}