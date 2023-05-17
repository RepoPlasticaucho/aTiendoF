export interface ModeloProductos {
    codigoError: string;
    descripcionError: string;
    lstModelo_Productos: ModeloProductosEntity[];
}

export interface ModeloProductosEntity {
    id?: string;
    marca_id: string;
    marca?: string;
    modelo_id: string;
    modelo?: string;
    categoria?: string;
    linea?: string;
    color_id: string;
    color?: string;
    atributo_id: string;
    atributo?: string;
    genero_id: string;
    genero?: string;
    modelo_producto: string;
    cod_sap: string;
    cod_familia?: string;
    etiquetas?: string;
    url_image: string;
}