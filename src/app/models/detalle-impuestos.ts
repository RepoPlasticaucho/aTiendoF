export interface DetalleImpuestos {
    codigoError: string;
    descripcionError: string;
    lstDetalleImpuestos: DetalleImpuestosEntity[];
}

export interface DetalleImpuestosEntity {
    id: string;
    detalle_movimiento_id: string;
    cod_impuesto: string;
    porcentaje: string;
    base_imponible: string;
    valor: string;
    created_at: string;
    updated_at: string;
    movimiento_id?: string;
}