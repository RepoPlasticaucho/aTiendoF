export interface SustentosTributarios {
    codigoError: string;
    descripcionError: string;
    lstSustentos: SustentosTributariosEntity[];
}

export interface SustentosTributariosEntity {
    id: string;
    etiquetas: string;
    created_at?: string;
    codigo: string;
    sustento: string;
    updated_at?: string;
}