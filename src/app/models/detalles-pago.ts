export interface DetallesPago {
    codigoError: string;
    descripcionError: string;
    lstDetallesPago: DetallesPagoEntity[];
}

export interface DetallesPagoEntity {
    id: string;
    movimiento_id: string;
    forma_pago_id: string;
    descripcion: string;
    valor: string;
    fecha_recaudo: string;
    created_at: string;
    updated_at: string;
}