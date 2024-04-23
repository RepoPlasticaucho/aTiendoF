export interface Personal {
    codigoError: string;
    descripcionError: string;
    lstSociedades: PersonalEntity[];
}

export interface PersonalEntity {
    idSociedad: string;
    idGrupo?: string;
    nombreGrupo?: string;
    razon_social?: string;
    nombre_comercial?: string;
    id_fiscal?: string;
    id_fiscal_grupo?: string;
    email: string;
    telefono: string;
    password: string;
    funcion: string;
    tipo_ambienteid: string;
    url_certificado?: string;
    clave_certificado?: string;
    dir1?: string;
    direccion?: string;
    ambiente?: string;
    email_certificado?: string;
    pass_certificado?: string;
    nombre_personal: string;
    sociedad_pertenece: string;
    almacen_personal_id?: string;
    
}