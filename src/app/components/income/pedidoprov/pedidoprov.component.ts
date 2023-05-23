import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faList, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { PedidoCreateComponent } from '../pedido-create/pedido-create.component';

@Component({
  selector: 'app-pedidoprov',
  templateUrl: './pedidoprov.component.html',
  styleUrls: ['./pedidoprov.component.css'],
  providers: [MatDialog]
})
export class PedidoprovComponent implements OnInit {
  
//Iconos para la pagina de grupos
faList = faList;
faEdit = faEdit;
faTrashAlt = faTrashAlt;
faPlus = faPlus;
//Declaración de variables
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject<any>();
lstModelosProductos: ModeloProductosEntity[] = [];

constructor(private readonly httpService: ModeloproductosService,
  private router: Router,
  private dialog: MatDialog) { }

  openModal(): void {
    const dialogRef = this.dialog.open(PedidoCreateComponent, {
      width: '500px',
      // Agrega cualquier configuración adicional del modal aquí
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Lógica para manejar el resultado después de cerrar el modal
    });
  }

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
    responsive: true
  }
  Swal.fire({
    title: 'CARGANDO...',
    html: 'Se están cargando los pedidos.',
    timer: 30000,
    didOpen: () => {
      Swal.showLoading();
      this.httpService.obtenerModelosProductos().subscribe(res => {
        console.log(res);
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error.',
            text: res.descripcionError,
            showConfirmButton: false,
            // timer: 3000
          });
        } else {
          this.lstModelosProductos = res.lstModelo_Productos;
          this.dtTrigger.next('');
          Swal.close();
        }
      });
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer');
    }
  });
}

ngOnDestroy(): void {
  this.dtTrigger.unsubscribe();
}

}
