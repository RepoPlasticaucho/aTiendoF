export interface ComprobanteCompras {
    codigoError: string;
    descripcionError: string;
    lstComprobantes: ComprobanteComprasEntity[];
}

export interface ComprobanteComprasEntity {
    id: string;
    tipo: string;
    codigo?: string;
}