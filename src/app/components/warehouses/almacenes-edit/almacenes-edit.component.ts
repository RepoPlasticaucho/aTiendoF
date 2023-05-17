import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-almacenes-edit',
  templateUrl: './almacenes-edit.component.html',
  styleUrls: ['./almacenes-edit.component.css']
})
export class AlmacenesEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;
  //Creación de la variable para formulario
  warehousesForm = new FormGroup({
    sociedad: new FormControl('0', Validators.required),
    Direccion: new FormControl('', [Validators.required]),
    codigo: new FormControl('', [Validators.required]),
    pto_emision: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
  });
  //Variables para listas desplegables
  lstSociedades: SociedadesEntity[] = [];
  selectSociedades: boolean = false;
  //Declaracion de variables
  private codigo: string = "";

  
  constructor(private readonly httpService: AlmacenesService,
    private readonly httpServiceSociedades: SociedadesService,
    private router: Router) { }

  ngOnInit(): void {
    //Obtener Grupos
    this.httpServiceSociedades.obtenerSociedades().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener la Sociedad.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstSociedades = res.lstSociedades;
        console.log(this.lstSociedades);
      }
    })
    //Cargar los datos Sociedad Modificar
    this.httpService.obteneralmacen$.subscribe(res => {
      if (res.idAlmacen == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.idAlmacen ?? "";
        this.warehousesForm.get("sociedad")?.setValue(res.sociedad_id);
        this.warehousesForm.get("Direccion")?.setValue(res.direccion);
        this.warehousesForm.get("codigo")?.setValue(res.codigo);
        this.warehousesForm.get("pto_emision")?.setValue(res.pto_emision);
        this.warehousesForm.get("telefono")?.setValue(res.telefono);
      }
    });
  }

  onSubmit(): void {
    if (!this.warehousesForm.valid) {
      this.warehousesForm.markAllAsTouched();
      if (this.warehousesForm.get("sociedad")?.value == "0") {
        this.selectSociedades = true;
      }
    } else {
      if (this.warehousesForm.get("sociedad")?.value == "0") {
        this.selectSociedades = true;
      }
      else {
        const almacenEntity: AlmacenesEntity = {
          sociedad_id: this.warehousesForm.value!.sociedad ?? "",
          direccion: this.warehousesForm.value!.Direccion ?? "",
          codigo: this.warehousesForm.value!.codigo ?? "",
          pto_emision: this.warehousesForm.value!.pto_emision ?? "",
          telefono: this.warehousesForm.value!.telefono ?? "",
          idAlmacen: this.codigo,
          nombresociedad: ''
        };
        this.httpService.actualizarAlmacen(almacenEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado Correctamente.',
              text: `Se ha actualizado la información`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['almacenes'] } }]);
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
    }
  }

  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  changeGroup(sociedad: any): void {
    if (sociedad.target.value == 0) {
      this.selectSociedades = true;
    } else {
      this.selectSociedades = false;
      this.warehousesForm.get("sociedad")?.setValue(sociedad.target.value);
    }
  }

  visualizarAlmacenes() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['almacenes'] } }]);
  }

}
