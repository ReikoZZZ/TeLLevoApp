import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {
  

  constructor(private router: Router) {}
  
  configuraciones() {
    this.router.navigate(['/configuraciones'])
  }

  inicio() {
    this.router.navigate(['/home'])
  } 
  
  perfil() {
    this.router.navigate(['/perfil'])
  } 

  ngOnInit() {
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

