export interface Tipoterceros {
    codigoError: string;
    descripcionError: string;
    lstTipo_Tercero: TipotercerosEntity[];
}

export interface TipotercerosEntity {
    idTipo_tercero : string;
    descripcion: string;
    codigo: string;
    created_at: string;
    update_at: string;
}