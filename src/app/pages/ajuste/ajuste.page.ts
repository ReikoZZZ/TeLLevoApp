import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-ajuste',
  templateUrl: './ajuste.page.html',
  styleUrls: ['./ajuste.page.scss'],
})
export class AjustePage implements OnInit {
  user: any; 
  email: string = ''; 
  nombre: string = '';

  constructor(private router: Router, private userService: UserService, private alertController :AlertController) {}

  ngOnInit() {
    // Recupera los datos del usuario desde el almacenamiento local
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }
  
  deleteProfile() {
    
    this.userService.deleteProfile(this.user.id)
      .subscribe(res => {
        // Eliminar del storage
        localStorage.removeItem('currentUser');
        
        // Redirigir a pagina de login
        this.router.navigateByUrl('/login');
      }) 
  }

  deleteAuto() {
    
    this.userService.deleteAuto(this.user.id)
      .subscribe(res => {
        
      }) 
  }

  async showDeleteConfirm() {

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Está seguro que desea eliminar su perfil? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.deleteAuto();
            this.deleteProfile();
            

          }
        }
      ]
    });
  
    await alert.present();
  
  }
  cambiarPerfil() {
    const email = this.email.trim();
    const username = this.nombre.trim();
  
    if (email === '' && username === '') {
      if (email === '') {
        this.email = this.user.email;
      }
      
      if (username === '') {
        this.nombre = this.user.nombre;
      }
  
      this.mostrarAlerta('Campos Vacíos', 'Por favor, llena todos los campos antes de guardar.');
    } else if (email === '' && username !== '') {
      this.user.email = this.user.email; // Mantener el correo actual del usuario
      this.user.nombre = username;
      this.mostrarAlerta('Guardado Exitoso', 'Los cambios se han guardado con éxito.');
    } else if (email !== '' && username === '') {
      this.user.email = email;
      this.user.nombre = this.user.nombre; // Mantener el nombre actual del usuario
      this.mostrarAlerta('Guardado Exitoso', 'Los cambios se han guardado con éxito.');
    } else {
      this.user.email = email;
      this.user.nombre = username;
      this.mostrarAlerta('Guardado Exitoso', 'Los cambios se han guardado con éxito.');
    }
  
    this.userService.updateUser(this.user.id, this.user)
      .subscribe(
        updatedUser => {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.user = updatedUser;
          console.log('Perfil actualizado!');
        },
        error => {
          console.error('Error al actualizar perfil', error);
        }
      );
  }
  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
  
    await alert.present();
  }
}
