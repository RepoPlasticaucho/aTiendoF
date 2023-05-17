import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { GruposEntity } from 'src/app/models/grupos';
import { GruposService } from 'src/app/services/grupos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos-create',
  templateUrl: './grupos-create.component.html',
  styleUrls: ['./grupos-create.component.css']
})
export class GruposCreateComponent implements OnInit {
  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;
  //Creación de la variable para formulario
  groupForm = new FormGroup({
    idFiscal: new FormControl('', [Validators.required, Validators.minLength(10)]),
    grupo: new FormControl('', Validators.required),
  });

  constructor(private readonly httpService: GruposService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (!this.groupForm.valid) {
      this.groupForm.markAllAsTouched();
    } else {
      const grupoEntity: GruposEntity = {
        id: "",
        grupo: this.groupForm.value!.grupo ?? "",
        idFiscal: this.groupForm.value!.idFiscal ?? "",
      }
      console.log(grupoEntity);
      this.httpService.agregarGrupo(grupoEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Guardado Exitosamente.',
            text: `Se ha creado el grupo ${this.groupForm.value.grupo}`,
            showConfirmButton: true,
            confirmButtonText: "Ok"
          }).finally(() => {
            this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['grupos'] } }]);
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

  visualizarGrupos():void{
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['grupos'] } }]);
  }

}
