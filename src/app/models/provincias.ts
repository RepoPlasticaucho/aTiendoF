export interface Provincias {
    codigoError: string;
    descripcionError: string;
    lstProvincias: ProvinciasEntity[];
}

export interface ProvinciasEntity {
    id? : string;
    provincia: string;
    codigo: string;
    created_at : string;
    update_at : string;
}