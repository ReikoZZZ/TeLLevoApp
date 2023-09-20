import { Component } from '@angular/core';
import { NgForm } from '@angular/forms'; // Importa NgForm si lo necesitas
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: 'formulario.page.html',
  styleUrls: ['formulario.page.scss'],
  
})
export class FormularioPage {

  constructor(private router: Router) {}

  tengoCuenta() {
    this.router.navigate(['/login']);
}

  closeModal() {
    this.router.navigate(['/login'])
  }
  submitForm(form: NgForm) {
    if (form.valid) {
      // Realiza las acciones necesarias cuando el formulario es válido
      const { email, username, password, confirmPassword } = form.value;
      console.log('Correo electrónico:', email);
      console.log('Nombre de usuario:', username);
      console.log('Contraseña:', password);
      console.log('Repetir contraseña:', confirmPassword);
      // Aquí puedes realizar la lógica de registro o cualquier otra acción
      this.router.navigate(['/login'])
    }
  }
}
export class ModalPage {
  // Contenido de la página modal
}

