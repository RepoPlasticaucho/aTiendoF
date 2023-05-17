export interface Roles {
    codigoError: string;
    descripcionError: string;
    lstRoles: RolesEntity[];
}

export interface RolesEntity {
    id: string;
    name: string;
}