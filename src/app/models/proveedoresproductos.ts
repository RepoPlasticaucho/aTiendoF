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
    created_at: string;
    updated_at: string;
    tamanio?: string;
    unidad_medida?: string;
    descripcion_uni?: string;
    marca?: string;
    cantidad?: string;
    etiquetas?: string;
}