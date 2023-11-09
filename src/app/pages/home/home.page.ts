import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import * as mapbox from 'mapbox-gl';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  user: any; 
  public map: mapbox.Map;
  constructor(private router: Router) {}
  

  ngOnInit() {
    // Recupera los datos del usuario desde el almacenamiento local
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }

  /*ionViewWillEnter(){
   if(!this.map){
    this.ConstruirMapa();
   }
  }*/
  
  configuraciones() {
    this.router.navigate(['/configuraciones'])
  }

  InterfazChofer() {
    this.router.navigate(['/interfaz-chofer'])
  }

 // ConstruirMapa(){
  
  /*this.map = new mapbox.Map({
    accessToken: environment.TOKEN,
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom:15,
    center: [
      -70.57906027403658,
      -33.59838997182398
    ]
    });
    
    const marker = new mapbox.Marker({color:'red'})
    .setLngLat([-70.57906027403658,-33.59838997182398])
    .addTo(this.map);
  }*/
}
