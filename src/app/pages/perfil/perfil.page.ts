import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  user: any; 
  email: string = ''; 
  sobreMi: string = ''; // Valor inicial de Sobre Mí
  idiomasSeleccionados = ['es']; // Valor inicial de Idioma
  comunaSeleccionada = 'Puente Alto'; // Valor inicial de Comuna


  idiomasDisponibles = [
    { id: 'es', nombre: 'Español' },
    { id: 'en', nombre: 'Inglés' },
    { id: 'fr', nombre: 'Francés' },
    // Agrega más idiomas según sea necesario
  ];


  comunasMetropolitana = [
    'La Florida', 
    'Las Condes', 
    'Maipú', 
    'Peñaflor', 
    'Pirque', 
    'Providencia', 
    'Puente Alto', 
    'San Bernardo', 
    'Santiago'
    // Agrega más comunas según sea necesario
  ];
  

  constructor(private router:Router, private userService: UserService) {}

  updateSobreMi() {
    // Asigna el valor del ion-textarea a la propiedad 'sobreMi' del usuario
    this.user.sobreMi = this.sobreMi;
  
    // Llama al servicio para actualizar el usuario en la base de datos
    this.userService.updateUser(this.user.id, this.user).subscribe(
      updatedUser => {
        // Maneja la respuesta del servidor si es necesario
        console.log('Usuario actualizado en la base de datos:', updatedUser);
  
        // Actualiza el usuario en el almacenamiento local
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
        // Actualiza la propiedad 'user' del componente con los datos actualizados
        this.user = updatedUser;
  
        console.log('Cambios guardados con éxito');
      },
      error => {
        // Maneja errores si ocurren durante la solicitud PUT
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }

  cambiarEmail() {
    // Asigna el valor del ion-textarea a la propiedad 'sobreMi' del usuario
    this.user.email = this.email;
  
    // Llama al servicio para actualizar el usuario en la base de datos
    this.userService.updateUser(this.user.id, this.user).subscribe(
      updatedUser => {
        // Maneja la respuesta del servidor si es necesario
        console.log('Usuario actualizado en la base de datos:', updatedUser);
  
        // Actualiza el usuario en el almacenamiento local
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  
        // Actualiza la propiedad 'user' del componente con los datos actualizados
        this.user = updatedUser;
  
        console.log('Cambios guardados con éxito');
      },
      error => {
        // Maneja errores si ocurren durante la solicitud PUT
        console.error('Error al actualizar el usuario:', error);
      }
    );
  }
  
  ngOnInit() {
    // Recupera los datos del usuario desde el almacenamiento local
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }
  inicio(){
    this.router.navigate(['/home'])
  }

  configuraciones(){
    this.router.navigate(['/configuraciones'])
  }



}
