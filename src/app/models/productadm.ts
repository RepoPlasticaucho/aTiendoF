export interface ProductAdm {
    codigoError: string;
    descripcionError: string;
    lstProductos: ProducAdmEntity[];
}

export interface ProducAdmEntity {
    id: string;
    tamanio: string;
    nombre: string;
    cod_sap: string;
    etiquetas: string;
    es_plasticaucho: string;
    es_sincronizado: string;
    modelo_producto_id: string;
    modelo_producto: string;
    impuesto_id: string;
    impuesto_nombre: string;
    marca_nombre: string;
    color_nombre: string;
    atributo_nombre: string;
    genero_nombre: string;
    modelo_nombre: string;
    categoria?: string;
    linea?: string;
}