import { Component, OnInit } from '@angular/core';
import { faList, faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';
import { SociedadesComponent } from '../../all_components';
import { SociedadesEntity } from 'src/app/models/sociedades';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})

export class PersonalComponent implements OnInit {
  faList = faList;
  faEdit = faEdit;
  faTrashAlt = faTrashAlt;
  faPlus = faPlus;
  //Declaración de variables
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  lstProveedores: ProveedoresEntity[] = [];

  constructor(private readonly httpService: ProveedoresService,
    private router: Router) { }


  ngOnInit(): void {
    this.dtOptions = {
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
      },
      paging: true,
      pageLength: 100,
      search: false,
      searching: true,
      ordering: true,
      info: true,
      responsive: true
    }
    Swal.fire({
      title: 'CARGANDO...',
      html: 'Se están cargando los proveedores.',
      timer: 30000,
      didOpen: () => {
        Swal.showLoading();
        const sociedad : SociedadesEntity ={
          idGrupo: '',
          idSociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]"),
          razon_social: '',
          nombre_comercial: '',
          id_fiscal: '',
          email: '',
          telefono: '',
          tipo_ambienteid: '',
          password: '',
          funcion: ''
        }
        this.httpService.obtenerProveedoresS(sociedad).subscribe(res => {
          if (res.codigoError != "OK") {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          } else {
            this.lstProveedores = res.lstProveedores;
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

  editarPersonal(proveedor: ProveedoresEntity): void {
    this.httpService.asignarProveedor(proveedor);
    // console.log(producto);
    this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['personal-edit'] } }]);
  }

  eliminarProveedor(proveedor: ProveedoresEntity): void {
    Swal.fire({
      icon: 'question',
      title: `¿Esta seguro de eliminar ${proveedor.nombre}?`,
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpService.eliminarProveedor(proveedor).subscribe(res => {
          if (res.codigoError == 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado Exitosamente.',
              text: `Se ha eliminado el proveedor ${proveedor.nombre}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).then(() => {
              // this.groupForm.reset();
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ha ocurrido un error.',
              text: res.descripcionError,
              showConfirmButton: false,
            });
          }
        })
        
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  agregarProveedor() {
    this.router.navigate(['/navegation-facturador', { outlets: { 'contentPersonal': ['personal-create'] } }]);
  }

}
