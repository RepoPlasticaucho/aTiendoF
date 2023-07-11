export interface Tarifas {
    codigoError: string;
    descripcionError: string;
    lstTarifas: TarifasEntity[];
}

export interface TarifasEntity {
    id: string;
    impuesto_id: string;
    codigo: string;
    porcentaje: string;
    descripcion: string;
    tarifa_ad_valorem_e_d_2020: string;
    tarifa_esp_e_d_2020: string;
    tarifa_esp_9_mayo_diciembre_2020: string;
    created_at: string;
    updated_at: string;
}