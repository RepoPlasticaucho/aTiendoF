export interface Almacenes {
    codigoError: string;
    descripcionError: string;
    lstAlmacenes: AlmacenesEntity[];
}

export interface AlmacenesEntity {
    idAlmacen : string;
    sociedad_id : string;
    nombresociedad: string;
    idfiscal_sociedad?: string;
    direccion : string;
    telefono : string;
    nombre_almacen?: string;
    codigo : string;
    pto_emision : string;
    
}