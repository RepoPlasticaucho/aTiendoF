export interface Tipousuarios {
    codigoError: string;
    descripcionError: string;
    lstTipo_Usuario: TipousuariosEntity[];
}

export interface TipousuariosEntity {
    idTipo_Usuario : string;
    usuario: string;
}