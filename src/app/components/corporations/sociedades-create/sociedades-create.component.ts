import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { GruposEntity } from 'src/app/models/grupos';
import { SociedadesEntity } from 'src/app/models/sociedades';
import { GruposService } from 'src/app/services/grupos.service';
import { SociedadesService } from 'src/app/services/sociedades.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { ImagenesService } from 'src/app/services/imagenes.service';
import { ImagenesEntity } from 'src/app/models/imagenes';
import { image } from 'html2canvas/dist/types/css/types/image';

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
  encPass2: string | undefined;
  encPass!: string;
  passwre!: string;

  //Creación de la variable para formulario
  corporationForm = new FormGroup({
    grupo: new FormControl('0', Validators.required),
    rol: new FormControl('0', Validators.required),
    idFiscal: new FormControl('', [Validators.required, Validators.minLength(10)]),
    nombreComercial: new FormControl('', Validators.required),
    correoElectronico: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
    tipoamb: new FormControl('0', Validators.required),
    contrasenia: new FormControl('', Validators.required),
    emiteRetencion: new FormControl('0', Validators.required),
    obligadoContabilidad: new FormControl('0', Validators.required),
    urlImagen: new FormControl(''),
    dir1: new FormControl('0', Validators.required),

  });
  //Variables para listas desplegables
  lstGrupos: GruposEntity[] = [];
  selectGrupo: boolean = false;
  selectRol: boolean = false;
  selectTipoAmb: boolean = false;
  selectEmiteRetencion: boolean = false;
  selectObligadoContabilidad: boolean = false;

  admin: string = 'admin';
  pruebas: string = '1';
  produccion: string = '2';
  client: string = 'client';
  bo: string = 'bo';
  personal: string = 'personal';
  no: string = '1';
  si: string = '2';


  //Variables para imagen
  fileToUpload: any;
  imageUrl: any =
    'https://calidad.atiendo.ec/eojgprlg/ModeloProducto/producto.png';
  imageBase64: string = '';
  imageName: string = '';
  codigoError: string = '';
  descripcionError: string = '';


  constructor(private readonly httpService: SociedadesService,
    private readonly httpServiceGrupos: GruposService,
    private httpServiceImage: ImagenesService,
    private router: Router
  
  ) { }

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
      if (this.corporationForm.get("obligadoContabilidad")?.value == "0") {
        this.selectObligadoContabilidad = true;
        return
      }

      if (this.corporationForm.get("emiteRetencion")?.value == "0") {
        this.selectEmiteRetencion = true;
        return
      }

      if (this.corporationForm.get("grupo")?.value == "0") {
        this.selectGrupo = true;
        return
      }
    } else {
      if (this.corporationForm.get("grupo")?.value == "0") {
        this.selectGrupo = true;
        return
      }
      else {

        

        var salt = CryptoJS.enc.Base64.parse("SXZhbiBNZWR2ZWRldg==");
        var iv = CryptoJS.enc.Hex.parse("69135769514102d0eded589ff874cacd");
        var key564Bits10000Iterations = CryptoJS.PBKDF2("Venus21!", salt, { keySize: 256 / 32 + 128 / 32, iterations: 10000, hasher: CryptoJS.algo.SHA512 });
        const pass = this.corporationForm.value!.contrasenia ?? ""
        var encrypted = CryptoJS.AES.encrypt(pass, key564Bits10000Iterations, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });

        this.passwre = pass;
        this.encPass = encrypted.toString();

        const sociedadEntity: SociedadesEntity = {
          idGrupo: this.corporationForm.value!.grupo ?? "",
          id_fiscal: this.corporationForm.value!.idFiscal ?? "",
          nombre_comercial: this.corporationForm.value!.nombreComercial ?? "",
          email: this.corporationForm.value!.correoElectronico ?? "",
          telefono: this.corporationForm.value!.telefono ?? "",
          funcion: this.corporationForm.value!.rol ?? "",
          idSociedad: '',
          tipo_ambienteid: this.corporationForm.value!.tipoamb ?? "",
          razon_social: '',
          password: this.encPass,
          emite_retencion: this.corporationForm.value!.emiteRetencion ?? "",
          obligado_contabilidad: this.corporationForm.value!.obligadoContabilidad ?? "",
          url_logo: this.imageName,
          dir1: this.corporationForm.value!.dir1 ?? "",
        };
        if (this.imageName != '') {
          const imageEntity: ImagenesEntity = {
            imageBase64: this.imageBase64,
            nombreArchivo: this.imageName,
            codigoError: '',
            descripcionError: '',
            nombreArchivoEliminar: '',
          };

          this.httpServiceImage
          .agregarImagenLS(imageEntity)
          .subscribe((res) => {
            if (res.codigoError == "OK") {
              console.log("Se agrego la imagen")
              sociedadEntity.url_logo = imageEntity.nombreArchivo;
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Ha ocurrido un error.',
                text: res.descripcionError,
                showConfirmButton: false,
              });
            }
          });

        }
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

  changeGroup3(tipoamb: any): void {
    if (tipoamb.target.value == 0) {
      this.selectTipoAmb = true;
    } else {
      this.selectTipoAmb = false;
      this.corporationForm.get("tipoamb")?.setValue(tipoamb.target.value);
    }
  }

  changeGroup4(emiteRetencion: any): void {
    if (emiteRetencion.target.value == "0" ) {
      this.selectEmiteRetencion = true;
    } else {
      this.selectEmiteRetencion = false;
      this.corporationForm.get("emiteRetencion")?.setValue(emiteRetencion.target.value);
    }
  }

  changeGroup5(obligadoConta: any): void {
    if (obligadoConta.target.value == "0" ) {
      this.selectObligadoContabilidad = true;
    } else {
      this.selectObligadoContabilidad = false;
      this.corporationForm.get("obligadoContabilidad")?.setValue(obligadoConta.target.value);
    }
  }

  visualizarSociedades() {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['sociedades'] } }]);
  }

  onChangeFile(target: any): void {
    if (target.value != "") {
      this.fileToUpload = target.files[0];
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
        this.imageBase64 = this.imageUrl.split(',')[1];
        this.imageName = this.fileToUpload.name;
      }
      reader.readAsDataURL(this.fileToUpload);
    }
  }

}
