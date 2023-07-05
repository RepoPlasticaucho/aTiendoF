export interface Marcas {
    codigoError: string;
    descripcionError: string;
    lstMarcas: MarcasEntity[];
}

export interface MarcasEntity {
    id: string;
    marca: string;
    proveedor_id?: string;
    proveedor?: string;
    etiquetas: string;
    url_image: string;
}