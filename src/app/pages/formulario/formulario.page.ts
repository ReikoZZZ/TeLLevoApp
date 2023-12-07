import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-formulario',
  templateUrl: 'formulario.page.html',
  styleUrls: ['formulario.page.scss'],
})
export class FormularioPage {
  
  constructor(private router: Router, 
    private userService: UserService, 
    private alertController: AlertController) {}


  tengoCuenta() {
    this.router.navigate(['/login']);
  }

  closeModal() {
    this.router.navigate(['/login']);
  }

  submitForm(form: NgForm) {
    if (form.valid) {
      // Copia los valores del formulario al objeto user
      const user: User = { ...form.value };
      
      // Elimina el campo "confirmPassword" del objeto user
      delete user.confirmPassword;
  
      // Verificar si las contraseñas coinciden
      if (user.contrasena === form.value.confirmPassword) {
        // Las contraseñas coinciden, puedes continuar con el registro
        this.userService.registerUser(user).subscribe(
          (response) => {
            // Manejar la respuesta del servidor JSON, por ejemplo, mostrar un mensaje de éxito o redirigir a la página de inicio de sesión.
            console.log('Usuario registrado con éxito:', response);
            this.router.navigate(['/login']);
          },
          (error) => {
            // Manejar errores, como mostrar un mensaje de error al usuario.
            console.error('Error al registrar usuario:', error);
          }
        );
      } else {
        // Las contraseñas no coinciden, muestra un mensaje de error o realiza la acción que desees
        console.error('Las contraseñas no coinciden');
        // También puedes mostrar un mensaje de error al usuario si lo deseas
      }
    }
  }
}