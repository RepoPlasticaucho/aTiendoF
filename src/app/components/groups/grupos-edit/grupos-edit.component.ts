import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { GruposEntity } from 'src/app/models/grupos';
import { GruposService } from 'src/app/services/grupos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grupos-edit',
  templateUrl: './grupos-edit.component.html',
  styleUrls: ['./grupos-edit.component.css']
})
export class GruposEditComponent implements OnInit {
  //Iconos para la pagina de grupos
  faTimes = faTimes;
  faUserFriends = faUserFriends;
  faSave = faSave;
  //Creación de la variable para formulario
  groupForm = new FormGroup({
    id: new FormControl(''),
    idFiscal: new FormControl('', [Validators.required, Validators.minLength(10)]),
    grupo: new FormControl('', Validators.required),
  });
  //Declaracion de variables
  private codigo: string = "";

  constructor(private readonly httpService: GruposService,
    private router: Router) { }

  ngOnInit(): void {
    this.httpService.obtenergrupo$.subscribe(res => {
      if (res.id == "") {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se ha obtenido información.',
          showConfirmButton: false,
        });
      } else {
        this.codigo = res.id;
        this.groupForm.get("idFiscal")?.setValue(res.idFiscal);
        this.groupForm.get("grupo")?.setValue(res.grupo);
      }
    });
  }

  onSubmit(): void {
    if (!this.groupForm.valid) {
      this.groupForm.markAllAsTouched();
    } else {
      const grupoEntity: GruposEntity = {
        id: this.codigo,
        grupo: this.groupForm.value!.grupo ?? "",
        idFiscal: this.groupForm.value!.idFiscal ?? "",
      }
      this.httpService.actualizarGrupo(grupoEntity).subscribe(res => {
        if (res.codigoError == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado Correctamente.',
            text: `Se ha actualizado la información`,
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

  visualizarGrupos(): void {
    this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['grupos'] } }]);
  }


}
