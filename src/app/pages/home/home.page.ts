import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as mapbox from 'mapbox-gl';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment.prod';
import { AlertController } from '@ionic/angular';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: any;
  startPoint: any;
  endPoint: any;
  showPedirViajeButton: boolean = false;
  viajeId: number;
  tieneAuto: boolean = false;

  public map: mapbox.Map;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Recupera los datos del usuario desde el almacenamiento local
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
  
      // Verifica si el usuario tiene un auto
      this.userService.hasAuto(this.user.id).subscribe(
        hasAuto => {
          this.tieneAuto = hasAuto;
  
          // Después de verificar si tiene auto, puedes realizar acciones adicionales si es necesario.
          // Por ejemplo, aquí puedes decidir si abrir el modal o redirigir a la interfaz de chofer.
          console.log('Respuesta de hasAuto:', hasAuto);
        },
        error => {
          console.error('Error al verificar si el usuario tiene auto:', error);
          // Puedes manejar el error según tus necesidades.
        }
      );
    }
  }

  async manejarAccionesSegunAuto() {
    console.log('Valor de user.tieneAuto:', this.user.tieneAuto);
    if (this.tieneAuto) {
      this.InterfazChofer();
    } else {
      await this.presentAlert();
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Ingresa los datos de tu vehiculo',
      inputs: [
        {
          name: 'marca',
          placeholder: 'Marca',
        },
        {
          name: 'modelo',
          placeholder: 'Modelo',
        },
        {
          name: 'color',
          placeholder: 'Color',
        },
        {
          name: 'patente',
          placeholder: 'Patente',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
        {
          text: 'Guardar',
          handler: (data) => {
            // Agrega el user_id al objeto de datos del auto
            data.user_id = this.user.id;
            // Actualizar el objeto user en la base de datos
            this.user.tieneAuto = 'SI';

            // Elimina la propiedad 'auto' del objeto user antes de enviarlo al servidor
            const { auto, ...userWithoutAuto } = this.user;

            // Actualizar el objeto user en la base de datos sin la propiedad 'auto'
            this.userService.updateUser(this.user.id, userWithoutAuto).subscribe((userResponse) => {
              console.log('Usuario actualizado:', userResponse);

              // Registrar el auto en la base de datos
              this.userService.registerAuto(data).subscribe((autoResponse) => {
                console.log('Auto registrado:', autoResponse);

                // Después de marcar el trazado y registrar el auto, mostrar el botón "Pedir Viaje"
                this.showPedirViajeButton = true;
              });
            });
          },
        },
      ],
    });

    await alert.present();
  }

  pedirViaje() {
    // Lógica para pedir el viaje
    if (this.startPoint && this.endPoint) {
      const viaje = {
        startPoint: {
          longitude: this.startPoint[0],
          latitude: this.startPoint[1]
        },
        endPoint: {
          longitude: this.endPoint[0],
          latitude: this.endPoint[1]
        },
        servicioTomado: false,
        userId: this.user.id,
      };

      // Registra el viaje en la base de datos
      this.userService.registrarViaje(viaje).subscribe((viajeResponse) => {
        console.log('Viaje registrado:', viajeResponse);
        this.viajeId = viajeResponse.id;
      });
    } else {
      console.error('startPoint o endPoint son undefined');
    }
  }

  ionViewWillEnter() {
    if (!this.map) {
      this.ConstruirMapa();
    }
  }

  configuraciones() {
    this.router.navigate(['/configuraciones']);
  }

  InterfazChofer() {
    window.location.reload(); // Recarga la página actual
    window.location.href = '/interfaz-chofer'; // Redirige a la ruta '/interfaz-chofer'
  }

  ConstruirMapa() {
    var duoc = [-70.57906027403658, -33.59838997182398];

    this.map = new mapbox.Map({
      accessToken: environment.TOKEN,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 15,
      center: [duoc[0], duoc[1]]
    });

    const marker = new mapbox.Marker({ color: 'red' })
      .setLngLat([duoc[0], duoc[1]])
      .addTo(this.map);

    const geocoder = new MapboxGeocoder({
      accessToken: environment.TOKEN,
      mapboxgl: mapbox
    });

    const geocoderElement = document.getElementById('geocoder');
    if (geocoderElement) {
      geocoderElement.appendChild(geocoder.onAdd(this.map));

      // Escuchar evento de resultado seleccionado del geocoder
      geocoder.on('result', (e) => {
        this.startPoint = [duoc[0], duoc[1]]; // Coordenadas del punto de inicio
        this.endPoint = e.result.geometry.coordinates; // Coordenadas del resultado del geocoder

        // Llamamos a la API de direcciones de Mapbox con las coordenadas obtenidas
        fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${duoc[0]},${duoc[1]};${this.endPoint[0]},${this.endPoint[1]}?steps=true&geometries=geojson&access_token=${environment.TOKEN}`)
          .then(response => response.json())
          .then(data => {
            // Dibujar la ruta en el mapa
            const route = data.routes[0].geometry;
            this.map.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route
              }
            });

            this.map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#888',
                'line-width': 8
              }
            });
          })
          .catch(error => {
            console.error('Error obteniendo direcciones:', error);
          });
      });
    } else {
      console.error("Elemento con ID 'geocoder' no encontrado.");
    }
  }
}
