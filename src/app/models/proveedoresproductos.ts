export interface ProveedoresProductos {
    codigoError: string;
    descripcionError: string;
    lstProveedoresProductos: ProveedoresProductosEntity[];
}

export interface ProveedoresProductosEntity {
    id: string;
    provedor_id: string;
    producto_id: string;
    nombre_producto: string;
    precio: string;
    costo?: string;
    productoExistente?: boolean;
    created_at: string;
    updated_at: string;
    tamanio?: string;
    unidad_medida?: string;
    descripcion_uni?: string;
    marca?: string;
    cantidad?: string;
    etiquetas?: string;
    cod_sap?: string;
    pvp2?: string;
    tieneCostoCalculado?: boolean;
    costoCalculado?: string;
}