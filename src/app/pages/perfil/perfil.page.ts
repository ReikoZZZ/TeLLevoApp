import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  sobreMi: string = 'Texto de Sobre Mí'; // Valor inicial de Sobre Mí
  comuna: string = 'Santiago'; // Valor inicial de Comuna
  idioma: string = 'Español, Inglés'; // Valor inicial de Idioma

  constructor(private router:Router) {}

  guardarCambios() {
    console.log('Cambios guardados con éxito');
  }
  ngOnInit() {
  }
  inicio(){
    this.router.navigate(['/home'])
  }

  configuraciones(){
    this.router.navigate(['/configuraciones'])
  }


}
