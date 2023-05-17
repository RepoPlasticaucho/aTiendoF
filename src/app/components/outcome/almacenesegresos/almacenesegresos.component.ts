import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEdit, faPlus, faTrashAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { ModeloProductosEntity } from 'src/app/models/modeloproductos';
import { ModeloproductosService } from 'src/app/services/modeloproductos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-almacenesegresos',
  templateUrl: './almacenesegresos.component.html',
  styleUrls: ['./almacenesegresos.component.css']
})
export class AlmacenesegresosComponent implements OnInit {
///Iconos para la pagina de grupos
faUserFriends = faUserFriends;
faEdit = faEdit;
faTrashAlt = faTrashAlt;
faPlus = faPlus;
//Declaración de variables
dtOptions: DataTables.Settings = {};
dtTrigger: Subject<any> = new Subject<any>();
lstModeloProductos: ModeloProductosEntity[] = [];

constructor(private readonly httpService: ModeloproductosService,
  private router: Router) { }

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
    responsive:true
  }

  this.httpService.obtenerModelosProductos().subscribe(res => {
    if (res.codigoError != "OK") {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: res.descripcionError,
        showConfirmButton: false,
        // timer: 3000
      });
    } else {
      this.lstModeloProductos = res.lstModelo_Productos;
      this.dtTrigger.next('');
    }
  })

}

}
