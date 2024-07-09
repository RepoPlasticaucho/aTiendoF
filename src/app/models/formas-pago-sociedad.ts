export interface FormasPagoSociedad {
    codigoError: string;
    descripcionError: string;
    lstFormasPagoSociedad: FormasPagoSociedadEntity[];
}

export interface FormasPagoSociedadEntity {
    id: string;
    forma_pago_id: string;
    sociedad_id: string;
    nombreFormaPago: string;
}