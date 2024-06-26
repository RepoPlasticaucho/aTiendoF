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
    pvp?: string;
    costo?: string;
    precio_prom? : string;
    etiquetas: string;
    es_plasticaucho: string;
    es_sincronizado: string;
    modelo_producto_id: string;
    modelo_producto: string;
    impuesto_id: string;
    impuesto_nombre: string;
    marca_nombre: string;
    color_nombre: string;
    tarifa_ice_iva_id?: string;
    tarifa_ice_iva?: string;
    unidad_medida?: string;
    atributo_nombre: string;
    genero_nombre: string;
    cantidad?: string;
    modelo_nombre: string;
    categoria?: string;
    linea?: string;
    url_image? :string;
    tarifa_ice_iva_nombre?: string;
    tarifa_ice_iva_id1?: string;
}