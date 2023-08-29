import { LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlmacenesComponent, AlmacenesCreateComponent, AlmacenesEditComponent, AlmacenesegresosComponent, AlmacenesshoopingComponent, AlmacenessociedadComponent, AlmacenessociedadCreateComponent, AlmacenessociedadEditComponent, AlmaceningresosComponent, AtributosComponent, AtributosCreateComponent, AtributosEditComponent, CarritoComponent, CarritoDevComponent, CatalogosComponent, CategoriasComponent, CategoriasCreateComponent, CategoriasEditComponent, ColorsComponent, ColorsCreateComponent, ColorsEditComponent, DashboardAdmComponent, DashboardBoComponent, DashboardClComponent, EstadopedidoComponent, GenerosComponent, GenerosCreateComponent, GenerosEditComponent, GruposComponent, GruposCreateComponent, GruposEditComponent, InventariosAlmacenComponent, InventariosComponent, InventariosCreateComponent, InventariosEditComponent, InventariosPedidoCategoriaComponent, InventariosPedidoColoresComponent, InventariosPedidoComponent, InventariosPedidoLineasComponent, InventariosPedidoModelosComponent, InventariosProductosComponent, LineasComponent, LineasCreateComponent, LineasEditComponent, MarcasComponent, MarcasCreateComponent, MarcasEditComponent, MenuventComponent, ModeloproductosComponent, ModeloproductosCreateComponent, ModeloproductosEditComponent, ModelosComponent, ModelosCreateComponent, ModelosEditComponent, NavegationAdmComponent, NavegationBoComponent, NavegationClComponent, PedidoprovComponent, PedidoSugeridoComponent, PedidoventComponent, PortafoliosComponent, PortafoliosDevComponent, PortafoliosComponentM, PortafoliosComprarComponent, PortafoliosComprarDevComponent, PortafoliosEditarComponent, ProductosComponent, ProductosCreateComponent, ProductosEditComponent, SociedadesComponent, SociedadesCreateComponent, SociedadesEditComponent, TercerosalmacenComponent, TercerosComponent, TercerosCreateComponent, TercerosEditComponent, TercerosusuariosComponent, TercerosusuariosCreateComponent, TercerosusuariosEditComponent, UsuarioComponent, UsuarioPassComponent, VerFacturaComponent, VistafacturaComponent, VistamarcasComponent,VistamarcasDevComponent, VistapedidosComponent, VistaventasComponent, VentaprovComponent, MenucomprComponent, CompraprovComponent, ProveedoresComponent, ProveedoresCreateComponent, ProveedoresEditComponent, MovimientosComponent, CashBalancingComponent, VerCompraComponent, ProductocompraComponent, ConfiguracionComponent, FacturaComponent } from './components/all_components';
import { LoginNavComponent } from './components/login-nav/login-nav.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  {
    path: 'navegation-cl', component: NavegationClComponent,
    children: [
      { path: "", component: DashboardClComponent, outlet: "contentClient" },
      { path: "almacenes", component: AlmacenessociedadComponent, outlet: "contentClient" },
      { path: "crearAlmacenes", component: AlmacenessociedadCreateComponent, outlet: "contentClient" },
      { path: "editarAlmacenes", component: AlmacenessociedadEditComponent, outlet: "contentClient" },
      { path: "inventarios", component: InventariosComponent, outlet: "contentClient" },
      { path: "editarAlmacenes", component: AlmacenessociedadEditComponent, outlet: "contentClient" },
      { path: "inventarios-pedido", component: InventariosPedidoComponent, outlet: "contentClient" },
      { path: "inventarios-pedido-categoria", component: InventariosPedidoCategoriaComponent, outlet: "contentClient" },
      { path: "inventarios-pedido-colores", component: InventariosPedidoColoresComponent, outlet: "contentClient" },
      { path: "inventarios-pedido-lineas", component: InventariosPedidoLineasComponent, outlet: "contentClient" },
      { path: "inventarios-pedido-modelos", component: InventariosPedidoModelosComponent, outlet: "contentClient" },
      { path: "inventarios-almacen", component: InventariosAlmacenComponent, outlet: "contentClient" },
      { path: "inventarios-productos", component: InventariosProductosComponent, outlet: "contentClient" },
      { path: "inventarios-create", component: InventariosCreateComponent, outlet: "contentClient" },
      { path: "inventarios-edit", component: InventariosEditComponent, outlet: "contentClient" },
      { path: "pedido-sugeridos", component: PedidoSugeridoComponent, outlet: "contentClient" },
      { path: "usuario", component: UsuarioComponent, outlet: "contentClient" },
      { path: "usuario-pass", component: UsuarioPassComponent, outlet: "contentClient" },
      { path: "tercerosalmacen", component: TercerosalmacenComponent, outlet: "contentClient" },
      { path: "tercerosusuarios-create", component: TercerosusuariosCreateComponent, outlet: "contentClient" },
      { path: "tercerosusuarios-edit", component: TercerosusuariosEditComponent, outlet: "contentClient" },
      { path: "tercerosusuarios", component: TercerosusuariosComponent, outlet: "contentClient" },
      { path: "modeloproductos", component: ModeloproductosComponent, outlet: "contentClient" },
      { path: "almacenegresos", component: AlmacenesegresosComponent, outlet: "contentClient" },
      { path: "almaceningresos", component: AlmaceningresosComponent, outlet: "contentClient" },
      { path: "vistapedidos", component: VistapedidosComponent, outlet: "contentClient" },
      { path: "pedidoprov", component: PedidoprovComponent, outlet: "contentClient" },
      { path: "vistamarcas", component: VistamarcasComponent, outlet: "contentClient" },
      { path: "portafolios", component: PortafoliosComponent, outlet: "contentClient" },
      { path: "portafolios-comprar", component: PortafoliosComprarComponent, outlet: "contentClient" },
      { path: "carrito", component: CarritoComponent, outlet: "contentClient" },
      { path: "portafolios-editar", component: PortafoliosEditarComponent, outlet: "contentClient" },
      { path: "vistafactura", component: VistafacturaComponent, outlet: "contentClient" },
      { path: "vistamarcas-dev", component: VistamarcasDevComponent, outlet: "contentClient" },
      { path: "portafolios-dev", component: PortafoliosDevComponent, outlet: "contentClient" },
      { path: "portafolios-comprar-dev", component: PortafoliosComprarDevComponent, outlet: "contentClient" },
      { path: "carrito-dev", component: CarritoDevComponent, outlet: "contentClient" },
      { path: "estadopedido", component: EstadopedidoComponent, outlet: "contentClient" },
      { path: "vistaventas", component: VistaventasComponent ,outlet:"contentClient"},
      { path: "ventaprov", component: VentaprovComponent , outlet:"contentClient"},
      { path: "pedidovent", component: PedidoventComponent , outlet:"contentClient"},
      { path: "menuvent", component:  MenuventComponent , outlet:"contentClient"},
      { path: "menucompr", component: MenucomprComponent , outlet:"contentClient"},
      { path: "ver-factura", component: VerFacturaComponent , outlet:"contentClient"},
      { path: "almacenesshooping", component: AlmacenesshoopingComponent , outlet:"contentClient"},
      { path: "compraprov", component: CompraprovComponent , outlet:"contentClient"},
      { path: "movimientos", component: MovimientosComponent , outlet:"contentClient"},
      { path: "proveedores", component: ProveedoresComponent, outlet: "contentClient" },
      { path: "proveedores-create", component: ProveedoresCreateComponent, outlet: "contentClient" },
      { path: "proveedores-edit", component: ProveedoresEditComponent, outlet: "contentClient" },
      { path: "cuadre-caja", component: CashBalancingComponent, outlet: "contentClient" },
      { path: "ver-compra", component: VerCompraComponent, outlet: "contentClient" },
      { path: "cofiguracion-user", component: ConfiguracionComponent , outlet: "contentClient" },
      { path: "factura", component: FacturaComponent , outlet: "contentClient" }

    ]
  },
  {
    path: 'navegation-adm', component: NavegationAdmComponent,
    children: [
      { path: "", component: DashboardAdmComponent, outlet: "contentAdmin" },
      { path: "almacenes", component: AlmacenesComponent, outlet: "contentAdmin" },
      { path: "crearAlmacenes", component: AlmacenesCreateComponent, outlet: "contentAdmin" },
      { path: "editarAlmacenes", component: AlmacenesEditComponent, outlet: "contentAdmin" },
      { path: "grupos", component: GruposComponent, outlet: "contentAdmin" },
      { path: "editarGrupos", component: GruposEditComponent, outlet: "contentAdmin" },
      { path: "crearGrupos", component: GruposCreateComponent, outlet: "contentAdmin" },
      { path: "sociedades", component: SociedadesComponent, outlet: "contentAdmin" },
      { path: "crearSociedades", component: SociedadesCreateComponent, outlet: "contentAdmin" },
      { path: "editarSociedades", component: SociedadesEditComponent, outlet: "contentAdmin" },
      { path: "categorias", component: CategoriasComponent, outlet: "contentAdmin" },
      { path: "crearCategorias", component: CategoriasCreateComponent, outlet: "contentAdmin" },
      { path: "editarCategorias", component: CategoriasEditComponent, outlet: "contentAdmin" },
      { path: "lineas", component: LineasComponent, outlet: "contentAdmin" },
      { path: "crearLineas", component: LineasCreateComponent, outlet: "contentAdmin" },
      { path: "editarLineas", component: LineasEditComponent, outlet: "contentAdmin" },
      { path: "modelos", component: ModelosComponent, outlet: "contentAdmin" },
      { path: "crearModelos", component: ModelosCreateComponent, outlet: "contentAdmin" },
      { path: "editarModelos", component: ModelosEditComponent, outlet: "contentAdmin" },
      { path: "marcas", component: MarcasComponent, outlet: "contentAdmin" },
      { path: "crearMarcas", component: MarcasCreateComponent, outlet: "contentAdmin" },
      { path: "editarMarcas", component: MarcasEditComponent, outlet: "contentAdmin" },
      { path: "colores", component: ColorsComponent, outlet: "contentAdmin" },
      { path: "crearColores", component: ColorsCreateComponent, outlet: "contentAdmin" },
      { path: "editarColores", component: ColorsEditComponent, outlet: "contentAdmin" },
      { path: "atributos", component: AtributosComponent, outlet: "contentAdmin" },
      { path: "crearAtributos", component: AtributosCreateComponent, outlet: "contentAdmin" },
      { path: "editarAtributos", component: AtributosEditComponent, outlet: "contentAdmin" },
      { path: "generos", component: GenerosComponent, outlet: "contentAdmin" },
      { path: "crearGeneros", component: GenerosCreateComponent, outlet: "contentAdmin" },
      { path: "editarGeneros", component: GenerosEditComponent, outlet: "contentAdmin" },
      { path: "modeloProductos", component: ModeloproductosComponent, outlet: "contentAdmin" },
      { path: "crearModeloProductos", component: ModeloproductosCreateComponent, outlet: "contentAdmin" },
      { path: "editarModeloProductos", component: ModeloproductosEditComponent, outlet: "contentAdmin" },
      { path: "productos", component: ProductosComponent, outlet: "contentAdmin" },
      { path: "crearProductos", component: ProductosCreateComponent, outlet: "contentAdmin" },
      { path: "editarProductos", component: ProductosEditComponent, outlet: "contentAdmin" },
      { path: "usuario", component: UsuarioComponent, outlet: "contentAdmin" },
      { path: "usuario-pass", component: UsuarioPassComponent, outlet: "contentAdmin" },
      { path: "catalogos", component: CatalogosComponent, outlet: "contentAdmin" },
      { path: "terceros", component: TercerosComponent, outlet: "contentAdmin" },
      { path: "terceros-create", component: TercerosCreateComponent, outlet: "contentAdmin" },
      { path: "terceros-edit", component: TercerosEditComponent, outlet: "contentAdmin" },
      { path: "portafoliosmigracion", component: PortafoliosComponentM, outlet: "contentAdmin" },
      { path: "proveedores", component: ProveedoresComponent, outlet: "contentAdmin" },
      //{ path: "proveedores-create", component: ProveedoresCreateComponent, outlet: "contentAdmin" },
      //{ path: "proveedores-edit", component: ProveedoresEditComponent, outlet: "contentAdmin" },
      { path: "producto-proveedores-migracion", component: ProductocompraComponent, outlet: "contentAdmin" },

    ]
  },
  {
    path: 'navegation-bo', component: NavegationBoComponent,
    children: [
      { path: "", component: DashboardBoComponent, outlet: "contentBo" },
      { path: "almacenes", component: AlmacenesComponent, outlet: "contentBo" },
      { path: "crearAlmacenes", component: AlmacenesCreateComponent, outlet: "contentBo" },
      { path: "editarAlmacenes", component: AlmacenesEditComponent, outlet: "contentBo" },
      { path: "grupos", component: GruposComponent, outlet: "contentBo" },
      { path: "editarGrupos", component: GruposEditComponent, outlet: "contentBo" },
      { path: "crearGrupos", component: GruposCreateComponent, outlet: "contentBo" },
      { path: "sociedades", component: SociedadesComponent, outlet: "contentBo" },
      { path: "crearSociedades", component: SociedadesCreateComponent, outlet: "contentBo" },
      { path: "editarSociedades", component: SociedadesEditComponent, outlet: "contentBo" },
      { path: "categorias", component: CategoriasComponent, outlet: "contentBo" },
      { path: "crearCategorias", component: CategoriasCreateComponent, outlet: "contentBo" },
      { path: "editarCategorias", component: CategoriasEditComponent, outlet: "contentBo" },
      { path: "lineas", component: LineasComponent, outlet: "contentBo" },
      { path: "crearLineas", component: LineasCreateComponent, outlet: "contentBo" },
      { path: "editarLineas", component: LineasEditComponent, outlet: "contentBo" },
      { path: "marcas", component: MarcasComponent, outlet: "contentBo" },
      { path: "crearMarcas", component: MarcasCreateComponent, outlet: "contentBo" },
      { path: "editarMarcas", component: MarcasEditComponent, outlet: "contentBo" },
      { path: "colores", component: ColorsComponent, outlet: "contentBo" },
      { path: "crearColores", component: ColorsCreateComponent, outlet: "contentBo" },
      { path: "editarColores", component: ColorsEditComponent, outlet: "contentBo" },
      { path: "atributos", component: AtributosComponent, outlet: "contentBo" },
      { path: "crearAtributos", component: AtributosCreateComponent, outlet: "contentBo" },
      { path: "editarAtributos", component: AtributosEditComponent, outlet: "contentBo" },
      { path: "productos", component: ProductosComponent, outlet: "contentAdmin" },
      { path: "crearProductos", component: ProductosCreateComponent, outlet: "contentAdmin" },
      { path: "editarProductos", component: ProductosEditComponent, outlet: "contentAdmin" },
    ]
  },
  
  {
    path: 'login-nav', component: LoginNavComponent,
    children: [
      { path: "", component: LoginComponent, outlet: "contentLogin" }
    ]
  },

  {
    path: '**', pathMatch: 'full', redirectTo:'login-nav',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
