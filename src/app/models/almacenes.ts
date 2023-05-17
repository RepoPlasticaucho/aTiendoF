export interface Almacenes {
    codigoError: string;
    descripcionError: string;
    lstAlmacenes: AlmacenesEntity[];
}

export interface AlmacenesEntity {
    idAlmacen : string;
    sociedad_id : string;
    nombresociedad: string;
    direccion : string;
    telefono : string;
    codigo : string;
    pto_emision : string;
    
}