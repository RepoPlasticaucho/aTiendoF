import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faSave, faTimes, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { AlmacenesEntity } from 'src/app/models/almacenes';
import { DescuentosEntity } from 'src/app/models/descuentos';
import { AlmacenesService } from 'src/app/services/almacenes.service';
import { DescuentosService } from 'src/app/services/descuentos.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-discounts-create',
  templateUrl: './discounts-create.component.html',
  styleUrls: ['./discounts-create.component.css']
})
export class DiscountsCreateComponent implements OnInit {

   //Iconos para la pagina de grupos
   faTimes = faTimes;
   faUserFriends = faUserFriends;
   faSave = faSave;
   selectSociedades: boolean = false;
   //Creación de la variable para formulario
   warehousesForm = new FormGroup({
     tipo: new FormControl('0'),
     codigoDescuento: new FormControl('', Validators.required),
     usoMaximo: new FormControl('', [Validators.required]),
     valorDescuento: new FormControl('', [Validators.required]),
     fecha_inicio: new FormControl('', [Validators.required]),
     fecha_fin: new FormControl('', [Validators.required]),
     tipoDescuento: new FormControl('0', Validators.required),
   });
   //Variables para listas desplegables
   selecttipoes: boolean = false;
 
   constructor(private readonly httpService: AlmacenesService,
    private readonly httpDiscounts: DescuentosService,
     private router: Router) { }
 
   ngOnInit(): void {
     //Obtener Grupos


   
   }
 
   keyPressNumbers(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);
    
    // Permitir números, punto decimal (.) y coma decimal (,)
    if (!charStr.match(/[\d.,]/)) {
        event.preventDefault();
        return false;
    }
    
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Permitir solo un punto o una coma decimal
    if ((charStr === '.' || charStr === ',') && (value.includes('.') || value.includes(','))) {
        event.preventDefault();
        return false;
    }
    
    return true;
}

onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Reemplazar múltiples puntos decimales con un solo punto decimal
    value = value.replace(/(\..*)\./g, '$1');
    
    // Reemplazar múltiples comas decimales con una sola coma decimal
    value = value.replace(/(,.*),/g, '$1');
    
    // Si se ha ingresado un punto decimal y una coma decimal, reemplazar el primer caso con una coma
    if (value.includes('.') && value.includes(',')) {
        value = value.replace('.', ',');
    }
    
    // Asegurarse de que el valor tiene solo números y un separador decimal
    const match = value.match(/^\d*([.,]?\d*)?$/);
    if (match) {
        input.value = match[0];
    } else {
        input.value = '';
    }
}

   
   changeGroup(tipo: any): void {
     if (tipo.target.value == 0) {
       this.selecttipoes = true;
     } else {
       this.selecttipoes = false;
       this.warehousesForm.get("tipo")?.setValue(tipo.target.value);
     }
   }


 
   visualizarAlmacenes() {
     this.router.navigate(['/navegation-adm', { outlets: { 'contentAdmin': ['almacenes'] } }]);
   }

   onSubmit(): void {

    //Controles
    if (this.warehousesForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Ha ocurrido un error.',
        text: 'Por favor, complete los campos requeridos.',
        showConfirmButton: false,
      });
      return;
    }

    //Controlar si es porcentaje y no esta entre 1 y 99 valor
    if (this.warehousesForm.value.tipoDescuento == "1") {
      if (parseFloat(this.warehousesForm.value.valorDescuento!) < 1 || parseFloat(this.warehousesForm.value.valorDescuento!) > 99) {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error.',
          text: 'El valor del descuento porcentual debe estar entre 1 y 100.',
          showConfirmButton: false,
        });
        return;
      }
    }


    //Construir el objeto
    const descuentoEntity: DescuentosEntity = {
      id: '',
      codigoDescuento: this.warehousesForm.value!.codigoDescuento ?? "",
      usoMaximo: this.warehousesForm.value!.usoMaximo ?? "",
      valorDescuento: this.warehousesForm.value!.valorDescuento ?? "",
      fecha_inicio: this.warehousesForm.value!.fecha_inicio ?? "",
      fecha_fin: this.warehousesForm.value!.fecha_fin ?? "",
      tipoDescuento: this.warehousesForm.value!.tipoDescuento ?? "",
      sociedad: JSON.parse(localStorage.getItem('sociedadid') || "[]")
      
    };

    this.httpDiscounts.agregarDescuento(descuentoEntity).subscribe(res => {
      if (res.codigoError == "OK") {
        Swal.fire({
          icon: 'success',
          title: 'Guardado Exitosamente.',
          text: `Se ha creado el descuento ${this.warehousesForm.value.codigoDescuento}`,
          showConfirmButton: true,
          confirmButtonText: "Ok"
        }).finally(() => {
          this.router.navigate(['/navegation-cl', { outlets: { 'contentClient': ['descuentos'] } }]);
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
