export interface DetallesMovimiento {
    codigoError: string;
    descripcionError: string;
    lstDetalleMovimientos: DetallesMovimientoEntity[];
}

export interface DetallesMovimientoEntity {
    id: string;
    producto_id: string;
    producto_nombre: string;
    modelo_producto_nombre?: string;
    tamanio?: string;
    color?: string;
    tarifa?: string;
    pto_emision?: string;
    inventario_id: string;
    movimiento_id: string;
    cod_tarifa?: string;
    desc_add?: string;
    cantidad: string;
    costo: string;
    unidad_medida?: string;
    precio: string;
    url_image?: string;
    created_at?: string;
    tipo_movimiento?: string;
    ice?: string;
    update_at?: string;
    codigo_impuesto?: string;
    documento?: string;
}