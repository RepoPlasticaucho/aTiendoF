export interface DetallesPago {
    codigoError: string;
    descripcionError: string;
    lstDetallePagos: DetallesPagoEntity[];
}

export interface DetallesPagoEntity {
    id: string;
    movimiento_id: string;
    forma_pago_id: string;
    descripcion: string;
    valor: string;
    valorE?: string;
    valorTD?: string;
    valorTC?: string;
    fecha_recaudo: string;
    created_at: string;
    updated_at: string;
}