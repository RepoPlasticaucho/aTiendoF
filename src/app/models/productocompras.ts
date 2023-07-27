export interface ProductosCompra {
    codigoError: string;
    descripcionError: string;
    lstProductos_Compra: ProductosCompraEntity[];
}
export interface ProductosCompraEntity {
    id: string;
    cliente: string;
    clienteid?: string;
    producto: string;
    productoid?: string;
    nombre_producto: string;
    proveedorid? : string;
    nombre_prove : string;
    precio: string;
    created_at : string;
    update_at : string;
}