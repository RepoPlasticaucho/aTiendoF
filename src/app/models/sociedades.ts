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
    id_fiscal_grupo?: string;
    email: string;
    telefono: string;
    password: string;
    funcion : string;
    tipo_ambienteid: string;
    url_certificado?: string;
    clave_certificado?: string;
    dir1?: string;
    direccion?: string;
    ambiente?: string;
}