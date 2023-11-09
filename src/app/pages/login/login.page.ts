import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  alertButtons: string[] = ['Enviar correo'];
  alertInputs: { placeholder: string }[] = [
    {
      placeholder: 'Ingrese correo',
    },
  ];

  async irMenu() {
    const nombre = this.usuario;
    const contrasena = this.password;

    // Llamando a la función verifyUser
    this.userService.verifyUser(nombre, contrasena).subscribe(
      (user) => {
        if (user === null) {
          // Usuario no encontrado
          console.log('Usuario no encontrado');
          // Mostrar un mensaje de error
          this.mostrarMensajeError('Credenciales incorrectas');
        } else {
          // Usuario encontrado
          console.log('Usuario encontrado:', user);

          // Almacena la información del usuario en el almacenamiento local
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Realiza una acción adicional, por ejemplo, redirigir al menú
          this.router.navigate(['/home']);
        }
      },
      (error) => {
        // Manejo de errores
        console.error('Error al verificar usuario:', error);
      }
    );
  }

  mostrarMensajeError(mensaje: string) {
    this.toastCtrl
      .create({
        message: mensaje,
        duration: 3000,
        position: 'bottom',
      })
      .then((toast) => toast.present());
  }

  crearCuenta() {
    this.router.navigate(['/formulario']);
  }
}
