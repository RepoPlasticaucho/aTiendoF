import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { GruposEntity } from 'src/app/models/grupos';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { GruposService } from 'src/app/services/grupos.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sociedades-create',
  templateUrl: './sociedades-create.component.html',
  styleUrls: ['./sociedades-create.component.css']
})
export class SociedadesCreateComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;
  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    grupo: new FormControl('0', Validators.required),
    rol: new FormControl('0', Validators.required),
    idFiscal: new FormControl('', [Validators.required, Validators.minLength(10)]),
    nombreComercial: new FormControl('', Validators.required),
    correoElectronico: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
  });
  //Variables para listas desplegables
  lstGrupos: GruposEntity[] = [];
  selectGrupo: boolean = false;
  selectRol: boolean = false;

  admin: string = 'admin';
  client: string = 'client';
  bo: string = 'bo';


  constructor(private readonly httpService: SociedadesService,
    private readonly httpServiceGrupos: GruposService,
    private router: Router) { }

  ngOnInit(): void {
    //Obtener Grupos
    this.httpServiceGrupos.obtenerGrupos().subscribe(res => {
      if (res.codigoError != "OK") {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo obtener Grupos.',
          text: res.descripcionError,
          showConfirmButton: false,
        });
      } else {
        this.lstGrupos = res.lstGrupos;
        console.log(this.lstGrupos);
      }
    })
  }

  onSubmit(): void {
    if (!this.corporationForm.valid) {
      this.corporationForm.markAllAsTouched();
      if (this.corporationForm.get("grupo")?.value == "0") {
        this.selectGrupo = true;
      }
    } else {
      if (this.corporationForm.get("grupo")?.value == "0") {
        this.selectGrupo = true;
      }
      else {
        const sociedadEntity: SociedadesEntity = {
          idGrupo: this.corporationForm.value!.grupo ?? "",
          id_fiscal: this.corporationForm.value!.idFiscal ?? "",
          nombre_comercial: this.corporationForm.value!.nombreComercial ?? "",
          email: this.corporationForm.value!.correoElectronico ?? "",
          telefono: this.corporationForm.value!.telefono ?? "",
          password: '',
          funcion: this.corporationForm.value!.rol ?? "",
          idSociedad: '',
          razon_social: ''
        };
        this.httpService.agregarSociedad(sociedadEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Guardado Exitosamente.',
              text: `Se ha creado la sociedad ${this.corporationForm.value.nombreComercial}`,
              showConfirmButton: true,
              confirmButtonText: "Ok"
            }).finally(() => {
              this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['sociedades'] } }]);
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
  
  changeGroup(grupo: any): void {
    if (grupo.target.value == 0) {
      this.selectGrupo = true;
    } else {
      this.selectGrupo = false;
      this.corporationForm.get("grupo")?.setValue(grupo.target.value);
    }
  }

  changeGroup2(rol: any): void {
    if (rol.target.value == 0) {
      this.selectRol = true;
    } else {
      this.selectRol = false;
      this.corporationForm.get("rol")?.setValue(rol.target.value);
    }
  }

  visualizarSociedades() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['sociedades'] } }]);
  }

}
