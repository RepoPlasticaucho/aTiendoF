import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GruposComponent } from './components/groups/grupos/grupos.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { GruposEditComponent } from './components/groups/grupos-edit/grupos-edit.component';
import { GruposCreateComponent } from './components/groups/grupos-create/grupos-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardClComponent } from './components/dashboard-cl/dashboard-cl.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { NavegationClComponent } from './components/navegation-cl/navegation-cl.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NavegationAdmComponent } from './components/navegation-adm/navegation-adm.component';
import { DashboardAdmComponent } from './components/dashboard-adm/dashboard-adm.component';
import { SociedadesComponent } from './components/corporations/sociedades/sociedades.component';
import { SociedadesCreateComponent } from './components/corporations/sociedades-create/sociedades-create.component';
import { SociedadesEditComponent } from './components/corporations/sociedades-edit/sociedades-edit.component';
import { AlmacenesCreateComponent } from './components/warehouses/almacenes-create/almacenes-create.component';
import { AlmacenesComponent } from './components/warehouses/almacenes/almacenes.component';
import { AlmacenesEditComponent } from './components/warehouses/almacenes-edit/almacenes-edit.component';
import { AlmacenessociedadComponent } from './components/warehouses/almacenessociedad/almacenessociedad.component';
import { AlmacenessociedadCreateComponent } from './components/warehouses/almacenessociedad-create/almacenessociedad-create.component';
import { AlmacenessociedadEditComponent } from './components/warehouses/almacenessociedad-edit/almacenessociedad-edit.component';
import { CategoriasComponent } from './components/categories/categorias/categorias.component';
import { CategoriasCreateComponent } from './components/categories/categorias-create/categorias-create.component';
import { CategoriasEditComponent } from './components/categories/categorias-edit/categorias-edit.component';
import { LineasComponent } from './components/lines/lineas/lineas.component';
import { LineasCreateComponent } from './components/lines/lineas-create/lineas-create.component';
import { LineasEditComponent } from './components/lines/lineas-edit/lineas-edit.component';
import { ModelosComponent } from './components/models/modelos/modelos.component';
import { ModelosCreateComponent } from './components/models/modelos-create/modelos-create.component';
import { ModelosEditComponent } from './components/models/modelos-edit/modelos-edit.component';
import { MarcasComponent } from './components/marks/marcas/marcas.component';
import { MarcasCreateComponent } from './components/marks/marcas-create/marcas-create.component';
import { MarcasEditComponent } from './components/marks/marcas-edit/marcas-edit.component';
import { ColorsComponent } from './components/colors/colors/colors.component';
import { ColorsCreateComponent } from './components/colors/colors-create/colors-create.component';
import { ColorsEditComponent } from './components/colors/colors-edit/colors-edit.component';
import { AtributosComponent } from './components/attributes/atributos/atributos.component';
import { AtributosCreateComponent } from './components/attributes/atributos-create/atributos-create.component';
import { AtributosEditComponent } from './components/attributes/atributos-edit/atributos-edit.component';
import { GenerosComponent } from './components/genres/generos/generos.component';
import { GenerosCreateComponent } from './components/genres/generos-create/generos-create.component';
import { GenerosEditComponent } from './components/genres/generos-edit/generos-edit.component';
import { ProductosComponent } from './components/products/productos/productos.component';
import { ProductosCreateComponent } from './components/products/productos-create/productos-create.component';
import { ProductosEditComponent } from './components/products/productos-edit/productos-edit.component';
import { InventariosComponent } from './components/inventories/inventarios/inventarios.component';
import { InventariosCreateComponent } from './components/inventories/inventarios-create/inventarios-create.component';
import { InventariosEditComponent } from './components/inventories/inventarios-edit/inventarios-edit.component';
import { InventariosPedidoComponent } from './components/inventories/inventarios-pedido/inventarios-pedido.component';
import { InventariosPedidoCreateComponent } from './components/inventories/inventarios-pedido-create/inventarios-pedido-create.component';
import { InventariosPedidoLineasComponent } from './components/inventories/inventarios-pedido-lineas/inventarios-pedido-lineas.component';
import { InventariosPedidoModelosComponent } from './components/inventories/inventarios-pedido-modelos/inventarios-pedido-modelos.component';
import { InventariosPedidoColoresComponent } from './components/inventories/inventarios-pedido-colores/inventarios-pedido-colores.component';
import { InventariosPedidoCategoriaComponent } from './components/inventories/inventarios-pedido-categoria/inventarios-pedido-categoria.component';
import { ModeloproductosComponent } from './components/models-products/modeloproductos/modeloproductos.component';
import { ModeloproductosCreateComponent } from './components/models-products/modeloproductos-create/modeloproductos-create.component';
import { ModeloproductosEditComponent } from './components/models-products/modeloproductos-edit/modeloproductos-edit.component';
import { PedidoSugeridoComponent } from './components/orders/pedido-sugerido/pedido-sugerido.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { PedidoSugeridoCreateComponent } from './components/orders/pedido-sugerido-create/pedido-sugerido-create.component';
import { PedidoSugeridoEditComponent } from './components/orders/pedido-sugerido-edit/pedido-sugerido-edit.component';
import { PedidoSugeridoLineaComponent } from './components/orders/pedido-sugerido-linea/pedido-sugerido-linea.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { LoginComponent } from './components/login/login.component';
import { LoginNavComponent } from './components/login-nav/login-nav.component';
import { NavegationBoComponent } from './components/navegation-bo/navegation-bo.component';
import { DashboardBoComponent } from './components/dashboard-bo/dashboard-bo.component';
import { InventariosAlmacenComponent } from './components/inventories/inventarios-almacen/inventarios-almacen.component';
import { InventariosProductosComponent } from './components/inventories/inventarios-productos/inventarios-productos.component';
import { UsuariosComponent } from './components/users/usuarios/usuarios.component';
import { UsuarioPassComponent } from './components/users/usuario-pass/usuario-pass.component';
import { UsuarioComponent } from './components/users/usuario/usuario.component';
import { CatalogosComponent } from './components/inventories/catalogos/catalogos.component';
import { TercerosComponent } from './components/users/terceros/terceros.component';
import { TercerosCreateComponent } from './components/users/terceros-create/terceros-create.component';
import { TercerosalmacenComponent } from './components/users/tercerosalmacen/tercerosalmacen.component';
import { TercerosusuariosComponent } from './components/users/tercerosusuarios/tercerosusuarios.component';
import { TercerosusuariosCreateComponent } from './components/users/tercerosusuarios-create/tercerosusuarios-create.component';
import { TercerosusuariosEditComponent } from './components/users/tercerosusuarios-edit/tercerosusuarios-edit.component';
import { TercerosEditComponent } from './components/users/terceros-edit/terceros-edit.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { AlmaceningresosComponent } from './components/income/almaceningresos/almaceningresos.component';
import { AlmacenesegresosComponent } from './components/outcome/almacenesegresos/almacenesegresos.component';
import { PedidoprovComponent } from './components/income/pedidoprov/pedidoprov.component';
import { PedidoventComponent } from './components/outcome/pedidovent/pedidovent.component';

@NgModule({
  declarations: [
    AppComponent,
    GruposComponent,
    GruposEditComponent,
    GruposCreateComponent,
    DashboardClComponent,
    NavegationClComponent,
    NavegationAdmComponent,
    DashboardAdmComponent,
    SociedadesComponent,
    SociedadesCreateComponent,
    SociedadesEditComponent,
    AlmacenesCreateComponent,
    AlmacenesComponent,
    AlmacenesEditComponent,
    AlmacenessociedadComponent,
    AlmacenessociedadCreateComponent,
    AlmacenessociedadEditComponent,
    CategoriasComponent,
    CategoriasCreateComponent,
    CategoriasEditComponent,
    LineasComponent,
    LineasCreateComponent,
    LineasEditComponent,
    ModelosComponent,
    ModelosCreateComponent,
    ModelosEditComponent,
    MarcasComponent,
    MarcasCreateComponent,
    MarcasEditComponent,
    ColorsComponent,
    ColorsCreateComponent,
    ColorsEditComponent,
    AtributosComponent,
    AtributosCreateComponent,
    AtributosEditComponent,
    GenerosComponent,
    GenerosCreateComponent,
    GenerosEditComponent,
    ProductosComponent,
    ProductosCreateComponent,
    ProductosEditComponent,
    InventariosComponent,
    InventariosCreateComponent,
    InventariosEditComponent,
    InventariosPedidoComponent,
    InventariosPedidoCreateComponent,
    InventariosPedidoLineasComponent,
    InventariosPedidoModelosComponent,
    InventariosPedidoColoresComponent,
    InventariosPedidoCategoriaComponent,
    ModeloproductosComponent,
    ModeloproductosCreateComponent,
    ModeloproductosEditComponent,
    PedidoSugeridoComponent,
    PedidoSugeridoCreateComponent,
    PedidoSugeridoEditComponent,
    PedidoSugeridoLineaComponent,
    LoginComponent,
    LoginNavComponent,
    NavegationBoComponent,
    DashboardBoComponent,
    InventariosAlmacenComponent,
    InventariosProductosComponent,
    UsuariosComponent,
    UsuarioPassComponent,
    UsuarioComponent,
    CatalogosComponent,
    TercerosComponent,
    TercerosCreateComponent,
    TercerosalmacenComponent,
    TercerosusuariosComponent,
    TercerosusuariosCreateComponent,
    TercerosusuariosEditComponent,
    TercerosEditComponent,
    AlmaceningresosComponent,
    AlmacenesegresosComponent,
    PedidoprovComponent,
    PedidoventComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,        
    MatNativeDateModule,        
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AutocompleteLibModule,
    FormsModule
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
