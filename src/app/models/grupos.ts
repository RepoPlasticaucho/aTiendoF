export interface Grupos {
    codigoError: string;
    descripcionError: string;
    lstGrupos: GruposEntity[];
}

export interface GruposEntity {
    id: string;
    grupo: string;
    idFiscal: string;
}