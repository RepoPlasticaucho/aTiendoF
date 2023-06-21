export interface Tipocomprobante {
    codigoError: string;
    descripcionError: string;
    lstTipo_Comprobante: TipocomprobanteEntity[];
}

export interface TipocomprobanteEntity {
    id : string;
    nombre: string;
    codigo: string;
    created_at: string;
    update_at: string;
}