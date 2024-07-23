export interface XmlCarga {
    codigoError: string;
    descripcionError: string;
    lstXmlCarga: XmlCargaEntity[];
}


export interface XmlCargaEntity {
    codigoSap: string;
    cantidad: string;
    costo: string;
    descuento?: string;
    precioUnitario?: string;

}