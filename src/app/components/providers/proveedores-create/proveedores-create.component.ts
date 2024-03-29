import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faList, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CiudadesEntity } from 'src/app/models/ciudades';
import { ProveedoresEntity } from 'src/app/models/proveedores';
import { CiudadesService } from 'src/app/services/ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proveedores-create',
  templateUrl: './proveedores-create.component.html',
  styleUrls: ['./proveedores-create.component.css']
})
export class ProveedoresCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faList = faList;
  faTimes = faTimes;
  faSave = faSave;
  //Variables para ejecucion del Form
  lstCiudades: CiudadesEntity[] = [];
  lstCiudades2: CiudadesEntity[] = [];
  selectCiudad: boolean = false;
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
    private readonly httpServiceCiudades: CiudadesService) { }

  ngOnInit(): void {
    this.httpServiceCiudades.obtenerCiudadesAll().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener las ciudades.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstCiudades = res.lstCiudades;
      }
    });
  }

  onSubmit() {
    if (!this.proveedoresForm.valid) {
      this.proveedoresForm.markAllAsTouched();
      console.log("Error");
    } else {
      const proveedorDatos: ProveedoresEntity = {
        id: '',
        ciudadid: this.lstCiudades2[0].idCiudad ?? 0,
        id_fiscal: this.proveedoresForm.value!.id_fiscal ?? "",
        correo: this.proveedoresForm.value!.correo ?? "",
        direccionprov: this.proveedoresForm.value!.direccion ?? "",
        nombre: this.proveedoresForm.value!.nombre ?? "",
        telefono: this.proveedoresForm.value!.telefono ?? "",
        sociedad_id : JSON.parse(localStorage.getItem('sociedadid') || "[]")
      }
      this.httpService.agregarProveedores(proveedorDatos).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el proveedor ${this.proveedoresForm.value.nombre}`,
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

  changeGroup(e: any) {

    if (e.target.value == 0) {
      this.selectCiudad = true;
    } else {
      this.selectCiudad = false;
    }
    if (e.target.value == null || undefined) {

    } else {
      const ciudad: CiudadesEntity = {
        idCiudad: '',
        ciudad: e.target.value,
        provinciaid: '',
        provincia: '',
        codigo: '',
        created_at: '',
        update_at: ''
      }
      this.httpServiceCiudades.obtenerCiudadesN(ciudad).subscribe(res => {
        if (res.codigoError != "OK") {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo obtener las ciudades.',
            text: res.descripcionError,
            showConfirmButton: false,
          });
        } else {
          this.lstCiudades2 = res.lstCiudades;
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
