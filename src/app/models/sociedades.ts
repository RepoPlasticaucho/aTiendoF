export interface Sociedades {
    codigoError: string;
    descripcionError: string;
    lstSociedades: SociedadesEntity[];
}

export interface SociedadesEntity {
    idGrupo: string;
    idSociedad: string;
    nombreGrupo?: string;
    razon_social: string;
    nombre_comercial: string;
    id_fiscal: string;
    email: string;
    telefono: string;
    password: string;
    funcion : string;
}