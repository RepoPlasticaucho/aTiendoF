export interface DetallesMovimiento {
    codigoError: string;
    descripcionError: string;
    lstDetallesMovimiento: DetallesMovimientoEntity[];
}

export interface DetallesMovimientoEntity {
    id: string;
    producto_id: string;
    producto_nombre: string;
    inventario_id: string;
    movimiento_id: string;
    cantidad: string;
    costo: string;
    precio: string;
}