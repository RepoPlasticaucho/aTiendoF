export interface PortafoliosM {
    codigoError: string;
    descripcionError: string;
    lstPortafolios: PortafoliosEntity[];
}
export interface PortafoliosEntity {
    id: string;
    cod_sap: string;
    sociedadid : string;
    cliente : string;
    almacen : string;
    almacenid : string;
    dir_almacen : string;
    material_sap : string;
    materialid : string;
    costo : string;
    pvp1 : string;
    pvp_sugerido : string;
    materialnombre? : string;
    stock?: string
}