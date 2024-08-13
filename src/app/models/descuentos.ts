export interface Descuentos {
    codigoError: string;
    descripcionError: string;
    lstDescuentos: DescuentosEntity[];
}


export interface DescuentosEntity {
    id: string;
    codigoDescuento: string;
    usoMaximo: string;
    valorDescuento: string;
    fecha_inicio: string;
    fecha_fin: string;
    tipoDescuento: string;
    sociedad: string;
    estado?: string;
}