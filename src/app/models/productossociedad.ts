export interface Productossociedad {
    codigoError: string;
    descripcionError: string;
    lstProductos: ProductossociedadEntity[];
}

export interface ProductossociedadEntity {
    producto_id: string;
    sociedad_id: string;
    costo: string;
}