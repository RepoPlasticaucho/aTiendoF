export interface Movimientos {
    codigoError: string;
    descripcionError: string;
    lstMovimientos: MovimientosEntity[];
}

export interface MovimientosEntity {
    id: string;
    tercero_id?: string;
    tipo_id: string;
    tipo_emision_cod: string;
    estado_fact_id: string;
    tipo_comprb_id: string;
    tipo_comprb?: string;
    almacen_id: string;
    estab?: string;
    cod_doc: string;
    secuencial: string;
    clave_acceso?: string;
    total_si?: string;
    total_desc?: string;
    total_imp?: string;
    detalle_pago?: string;
    propina?: string;
    proveedor_id?: string;
    proveedor?: string;
    comp_venta?: string;
    sustento_id?: string;
    sustento?: string;
    autorizacion_venta?: string;
    fecha_emision?: string;
    importe_total?: string;
    valor_rete_iva?: string;
    valor_rete_renta?: string;
    camp_ad1?: string;
    camp_ad2?: string;
    updated_at?: string;
    tercero?: string;
    tipo_comprb_cod?: string;
    id_fiscal_soc?: string;
    tipo_ambiente?: string;
    pto_emision?: string;
    url_factura?: string;
    comprobante_compra_id?: string;
}