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
  selector: 'app-sociedades-edit',
  templateUrl: './sociedades-edit.component.html',
  styleUrls: ['./sociedades-edit.component.css']
})
export class SociedadesEditComponent implements OnInit {

  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;
  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    grupo: new FormControl('0', Validators.required),
    idFiscal: new FormControl('', [Validators.required, Validators.minLength(10)]),
    rol: new FormControl('0', Validators.required),
    nombreComercial: new FormControl('', Validators.required),
    correoElectronico: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
    tipoamb: new FormControl('0', Validators.required),
    emiteRetencion: new FormControl('0', Validators.required),
    obligatorioContabilidad: new FormControl('0', Validators.required),
  });
  //Variables para listas desplegables
  lstGrupos: GruposEntity[] = [];
  selectGrupo: boolean = false;
  selectRol: boolean = false;
  selectTipoAmb: boolean = false;
  selectEmiteRetencion: boolean = false;
  selectObligadoContabilidad: boolean = false;
  //Declaracion de variables
  private codigo: string = "";
  admin: string = 'admin';
  pruebas: string = '1';
  produccion: string = '2';
  client: string = 'client';
  bo: string = 'bo';
  si: string = '2';
  no: string = '1';

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
      }
    })
    //Cargar los datos Sociedad Modificar
    this.httpService.obtenersociedad$.subscribe(res => {
      if (res.idSociedad == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.idSociedad ?? "";
        this.corporationForm.get("grupo")?.setValue(res.idGrupo);
        if (res.funcion == "") {
          this.corporationForm.get("rol")?.setValue("0");
        } else {
          this.corporationForm.get("rol")?.setValue(res.funcion);
        }
        console.log(res)
        this.corporationForm.get("tipoamb")?.setValue(res.tipo_ambienteid!);
        this.corporationForm.get("idFiscal")?.setValue(res.id_fiscal);
        this.corporationForm.get("nombreComercial")?.setValue(res.nombre_comercial);
        this.corporationForm.get("correoElectronico")?.setValue(res.email);
        this.corporationForm.get("telefono")?.setValue(res.telefono);
        this.corporationForm.get("emiteRetencion")?.setValue(res.emite_retencion!);
        this.corporationForm.get("obligatorioContabilidad")?.setValue(res.obligado_contabilidad!);
      }
    });
  }

  onSubmit(): void {
    if (!this.corporationForm.valid) {
      this.corporationForm.markAllAsTouched();
      if (this.corporationForm.get("grupo")?.value == "0") {
        this.selectGrupo = true;
      }
      if (this.corporationForm.get("rol")?.value == "0") {
        this.selectRol = true;
      }
    } else {
      if (this.corporationForm.get("grupo")?.value == "0") {
        this.selectGrupo = true;
      }
      if (this.corporationForm.get("rol")?.value == "0") {
        this.selectRol = true;
      }
      else {
        const sociedadEntity: SociedadesEntity = {
          idSociedad: this.codigo,
          idGrupo: this.corporationForm.value!.grupo ?? "",
          id_fiscal: this.corporationForm.value!.idFiscal ?? "",
          nombre_comercial: this.corporationForm.value!.nombreComercial ?? "",
          email: this.corporationForm.value!.correoElectronico ?? "",
          telefono: this.corporationForm.value!.telefono ?? "",
          password: '',
          tipo_ambienteid: this.corporationForm.value!.tipoamb ?? "",
          funcion: this.corporationForm.value!.rol ?? "",
          razon_social: '',
          emite_retencion: this.corporationForm.value!.emiteRetencion ?? "",
          obligado_contabilidad: this.corporationForm.value!.obligatorioContabilidad ?? "",
        };
        this.httpService.actualizarSociedad(sociedadEntity).subscribe(res => {
          if (res.codigoError == "OK") {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado Correctamente.',
              text: `Se ha actualizado la información`,
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

  changeGroup3(tipoamb: any): void {
    if (tipoamb.target.value == 0) {
      this.selectTipoAmb = true;
    } else {
      this.selectTipoAmb = false;
      this.corporationForm.get("tipoamb")?.setValue(tipoamb.target.value);
    }
  }

  changeGroup4(emiteRetencion: any): void {
    if (emiteRetencion.target.value == 0) {
      this.selectEmiteRetencion = true;
    } else {
      this.selectEmiteRetencion = false;
      this.corporationForm.get("emiteRetencion")?.setValue(emiteRetencion.target.value);
    }
  }


  changeGroup5(obligatorioConta: any): void {
    if (obligatorioConta.target.value == 0) {
      this.selectObligadoContabilidad = true;
    } else {
      this.selectObligadoContabilidad = false;
      this.corporationForm.get("obligatorioContabilidad")?.setValue(obligatorioConta.target.value);
    }
  }

  visualizarSociedades() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['sociedades'] } }]);
  }

}
