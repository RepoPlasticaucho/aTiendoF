import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { PersonalService } from 'src/app/services/personal.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-edit',
  templateUrl: './personal-edit.component.html',
  styleUrls: ['./personal-edit.component.css']
})
export class PersonalEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  selectCiudad: boolean = false;
  private codigo: string = '';
  //Creación de la variable para formulario
  proveedoresForm = new FormGroup({
    nombre: new FormControl(''),
    id_fiscal: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    ciudad: new FormControl('0', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
  })

  constructor(private readonly httpService: ProveedoresService,
    private router: Router,
    private readonly httpPersonal: PersonalService,
  ) { }

  ngOnInit(): void {

    this.httpPersonal.obtenerpersonal$.subscribe((res) => {
      if (res.idSociedad == '') {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.idSociedad ?? '';
        this.proveedoresForm.get('nombre')?.setValue(res.nombre_personal);
        this.proveedoresForm.get('correo')?.setValue(res.email);
        this.proveedoresForm.get('telefono')?.setValue(res.telefono);
      }
    });

  }

  onSubmit() {
    if (!this.proveedoresForm.valid) {
      this.proveedoresForm.markAllAsTouched();
      console.log("Error");
    } else {
      const proveedorDatos: ProveedoresEntity = {
        id: this.codigo,
        ciudadid: this.lstCiudades2[0].idCiudad ?? 0,
        id_fiscal: this.proveedoresForm.value!.id_fiscal ?? "",
        correo: this.proveedoresForm.value!.correo ?? "",
        direccionprov: this.proveedoresForm.value!.direccion ?? "",
        nombre: this.proveedoresForm.value!.nombre ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
      }
      this.httpService.actualizarProveedores(proveedorDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha actualizado el proveedor ${this.proveedoresForm.value.nombre}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['proveedores'] } }]);
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

  

  visualizarProveedores() {
    this.router.navigate([
      '/navegation-cl',
      { outlets: { contentClient: ['proveedores'] } },
    ]);
  }

}

