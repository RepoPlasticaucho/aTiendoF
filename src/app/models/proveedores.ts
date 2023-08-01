export interface Proveedores {
    codigoError: string;
    descripcionError: string;
    lstProveedores: ProveedoresEntity[];
}

export interface ProveedoresEntity {
    id: string;
    sociedad_id?:string;
    nombre_sociedad?: string;
    id_fiscal: string;
    ciudadid: string;
    ciudad?: string;
    correo: string;
    created_at?: string;
    direccionprov: string;
    nombre: string;
    telefono: string;
    updated_at?: string;
}