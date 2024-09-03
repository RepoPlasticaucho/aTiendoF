import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends, faShoppingBag, faReply, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { MovimientosEntity } from 'src/app/models/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { SriwsService } from 'src/app/services/sriws.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estado-facturas',
  templateUrl: './estado-facturas.component.html',
  styleUrls: ['./estado-facturas.component.css'],
  
})
export class EstadoFacturasComponent implements OnInit {

 ///Iconos para la pagina de grupos
 faUserFriends = faUserFriends;
 faEnvelope = faEnvelope;
 faShoppingBag = faShoppingBag;
 faEdit = faEdit;
 faTrashAlt = faTrashAlt;
 faPlus = faPlus;
  faReply = faReply;
 //Declaración de variables
 dtOptions: DataTables.Settings = {};
 dtTrigger: Subject<any> = new Subject<any>();
 lstMovimientos: MovimientosEntity[] = [];

 constructor(private readonly httpService: MovimientosService,
   private router: Router,
   private readonly httpSri: SriwsService
  
  ) { }

 ngOnInit(): void {
   this.dtOptions = {
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
    },
    paging: true,
    search: false,
    searching: true,
    ordering: true,
    info: true,
    order: [[0, 'desc']] // Ordenar por la primera columna de mayor a menor
   }

   //Crear movimiento
   const movimiento: MovimientosEntity = {
      id:"",
      tipo_id: '',
      tipo_emision_cod: '',
      estado_fact_id: '',
      tipo_comprb_id: '',
      almacen_id: localStorage.getItem('almacenid')!,
      cod_doc: '',
      secuencial: '',
      importe_total: '',
      valor_rete_iva: '',
      valor_rete_renta: '',
      updated_at: '',
      tercero: '',
      tipo_comprb_cod: '',
      id_fiscal_soc: '',
      tipo_ambiente: '',
      pto_emision: '',
      url_factura: '',
      comprobante_compra_id: '',
      nroFactura: ''
    }

    this.httpService.obtenerMovimientoClaveAlmacen(movimiento).subscribe(res => {
      if(res.codigoError === 'OK'){
        this.lstMovimientos = res.lstMovimientos;

        this.lstMovimientos.forEach(movimiento => {
          movimiento.nroFactura = movimiento.clave_acceso?.substring(24,39);
        });

        this.dtTrigger.next("")


      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.descripcionError
        });
      }
    });
    


  }


  enviarComprobante(movimiento: MovimientosEntity) {
    // Mostrar la pantalla de carga (spinner)
    Swal.fire({
      title: 'Enviando...',
      text: 'Por favor, espere mientras se envía el comprobante.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.httpSri.enviarComprobanteCorreo(movimiento.id).subscribe(
      res => {
        if (res === 'Correo enviado correctamente') {
          console.log(res);
          // Actualizar la alerta con el resultado y cerrar el spinner
          Swal.fire({
            icon: 'success',
            title: 'Finalizado Correctamente.',
            text: 'Se ha finalizado la venta y enviado el comprobante',
            confirmButtonText: 'Ok'
          });
        } else {
          console.log(res);
          // En caso de error, mostrar un mensaje de error
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el comprobante.',
            confirmButtonText: 'Ok'
          });
        }
      },
      error => {
        // En caso de error en la petición, mostrar un mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al intentar enviar el comprobante.',
          confirmButtonText: 'Ok'
        });
      }
    );
  }

  volverAAutorizar(movimiento: MovimientosEntity){
    this.httpSri.autorizarXMLSri(movimiento.id).subscribe(res5 => {
                              
      const palabras: string[] = res5.split(' ');
      console.log(palabras)
      localStorage.setItem('fechaAutoriz', palabras.slice(1).join(' '));
      //Cerrar pantalla de carga
      if(palabras[0] = 'AUTORIZADO'){
        movimiento.camp_ad2 = "AUTORIZADO";
        movimiento.estado_mensaje = "Sin Novedad"
      } else {
        movimiento.camp_ad2 = "NO AUTORIZADO";
        movimiento.estado_mensaje = "Recarga la pantalla para visualizar el mensaje";
      }
      
    });

  }

  nuevaFactura() {
    this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['almacenegresos'] } }]);
  }


}
