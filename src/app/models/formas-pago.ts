export interface FormasPago {
    codigoError: string;
    descripcionError: string;
    lstFormasPago: FormasPagoEntity[];
}

export interface FormasPagoEntity {
    id: string;
    nombre: string;
    codigo: string;
    fecha_inicio: string;
    fecha_fin: string;
    created_at: string;
    updated_at: string;
}