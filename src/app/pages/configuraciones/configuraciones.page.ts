import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {
  user: any; // Asume el tipo correcto de datos del usuario

  constructor(private router: Router, private userService: UserService) {}

  configuraciones() {
    this.router.navigate(['/configuraciones']);
  }

  inicio() {
    this.router.navigate(['/home']);
  }

  perfil() {
    this.router.navigate(['/perfil']);
  }

  ajustes() {
    this.router.navigate(['/ajuste']);
  }

  ngOnInit() {
    // Recupera los datos del usuario desde el almacenamiento local
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }

  public alertButtons = [
    {
      text: 'No',
      role: 'cancel',
      handler: () => {
        console.log('Alert canceled');
      },
    },
    {
      text: 'Si',
      role: 'confirm',
      handler: () => {
        console.log('Alert confirmed');
        this.router.navigate(['/login']);
      },
    },
  ];
}
