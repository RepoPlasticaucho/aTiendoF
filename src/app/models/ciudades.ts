export interface Ciudades {
    codigoError: string;
    descripcionError: string;
    lstCiudades: CiudadesEntity[];
}

export interface CiudadesEntity {
    idCiudad : string;
    ciudad: string;
    provinciaid: string;
    provincia: string
    codigo: string;
    created_at : string;
    update_at : string;
}