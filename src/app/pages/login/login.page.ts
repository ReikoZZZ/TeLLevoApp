import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage implements OnInit{
  email:string = '';
  password:string = '';

  constructor(private router: Router,
              private toastCtrl:ToastController) {}
  
  ngOnInit() {
  }

  async irMenu(){
    if (this.email=="admin" && this.password=="1234") {
        this.router.navigate(['/home']);
    }else{
      let t=this.toastCtrl.create({
        message:"El correo o contraseña son incorrectos",
        duration:3000,
        position:'bottom'
      });
      (await t).present();
    }
    
  }         
  crearCuenta() {
    this.router.navigate(['/formulario'])
  }

  public alertButtons = ['Enviar correo'];
  public alertInputs = [
    {
      placeholder: 'Ingrese correo',
    },
  ];

}
