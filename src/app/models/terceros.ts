export interface Terceros {
    codigoError: string;
    descripcionError: string;
    lstTerceros: TercerosEntity[];
}

export interface TercerosEntity {
    id? : string;
    almacen_id : string;
    sociedad_id : string;
    tipotercero_id : string;
    tipousuario_id : string;
    nombresociedad: string;
    nombrealmacen: string;
    nombretercero: string;
    tipousuario: string;
    nombre: string;
    id_fiscal: string;
    direccion : string;
    telefono : string;
    correo : string;
    fecha_nac : string;
    ciudad : string;
    provincia:string;
    ciudadid: string;
}