import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as mapbox from 'mapbox-gl';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment.prod';
import { AlertController } from '@ionic/angular';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-interfaz-chofer',
  templateUrl: './interfaz-chofer.page.html',
  styleUrls: ['./interfaz-chofer.page.scss'],
})
export class InterfazChoferPage implements OnInit {
  public map: mapbox.Map;
  user: any; 
  startPoint: any;
  endPoint: any;
  viajesDisponibles: any[] = [];
  nombreUbicacion: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Recupera los datos del usuario desde el almacenamiento local
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }

  configuraciones() {
    this.router.navigate(['/configuraciones']);
  }

  InterfazChofer() {
    window.location.reload(); // Recarga la página actual
    window.location.href = '/home'; // Redirige a la ruta '/interfaz-chofer'
  }

  ionViewWillEnter() {
    if (!this.map) {
      this.ConstruirMapa();

      // Recuperar los viajes disponibles cuando se carga la interfaz del chofer
      this.recuperarViajesDisponibles();
    }
  }

  async recuperarViajesDisponibles() {
    this.userService.getTodosViajesDisponibles().subscribe((viajes) => {
      // Para cada viaje, realiza la llamada a reverseGeocode y obtén la información del usuario
      viajes.forEach((viaje) => {
        if (viaje.endPoint && viaje.endPoint.longitude && viaje.endPoint.latitude) {
          const endPointCoordinates = [viaje.endPoint.longitude, viaje.endPoint.latitude];
          
          this.reverseGeocode(endPointCoordinates).then(() => {
            // Agrega el nombre de la ubicación al objeto del viaje
            viaje.nombreUbicacion = this.nombreUbicacion;
  
            // Si hay un usuario asociado al viaje, obten su información
            if (viaje.userId) {
              this.userService.getUserById(viaje.userId).subscribe(
                (usuario: any) => {
                  // Agrega el nombre del usuario al objeto del viaje
                  viaje.nombreUsuario = usuario && usuario.nombre ? usuario.nombre : 'Usuario Desconocido';
                },
                (error) => {
                  console.error('Error obteniendo información del usuario:', error);
                }
              );
            } else {
              // Si no hay usuario asociado, establece el nombre de usuario como "Usuario Desconocido"
              viaje.nombreUsuario = 'Usuario Desconocido';
            }
          });
        }
      });
  
      // Asigna los viajes actualizados a la propiedad viajesDisponibles
      this.viajesDisponibles = viajes;
    });
  }

  // Agrega una propiedad nombreUbicacion al objeto viaje
  mostrarModalConDatos(viaje: any, nombreUsuario: string | null) {
    viaje.nombreUbicacion = this.nombreUbicacion;
  
    const modalData = {
      viaje: viaje,
      nombreUsuario: nombreUsuario,
      nombreUbicacion: this.nombreUbicacion,
    };
  }

  agregarViajeTomado(viaje: any) {
    // Verificar que el viaje no haya sido tomado previamente
    if (!viaje.servicioTomado) {
      // Aquí puedes agregar la lógica para agregar a la base de datos
      // Utiliza viaje.idChofer, viaje.usuarioId y otros campos según sea necesario
  
      // Luego, actualiza el estado local para marcar el viaje como tomado
      viaje.servicioTomado = true;
    } else {
      console.log('Este viaje ya fue tomado.');
    }
  }

  async ModificarDatos(viaje: any) {
    if (viaje.endPoint && viaje.endPoint.longitude && viaje.endPoint.latitude) {
      const endPointCoordinates = [viaje.endPoint.longitude, viaje.endPoint.latitude];
  
      // Obtener el ID del usuario desde LocalStorage
      const usuarioId = this.user ? this.user.id : null;
  
      if (usuarioId) {
        const alert = await this.alertController.create({
          header: 'Confirmar',
          message: '¿Estás seguro de aceptar el viaje?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => {
                console.log('Aceptación de viaje cancelada');
              }
            },
            {
              text: 'Aceptar',
              handler: async () => {
                try {
                  // Llamas a la función para modificar el viaje
                  await this.userService.modificarViaje(viaje.id, usuarioId).toPromise();
  
                  // Luego, actualizas el mapa con la información actualizada del viaje
                  this.ActualizarMapa(viaje);
  
                  // Finalmente, muestras un mensaje de confirmación
                  await this.mostrarMensajeConfirmacion();
                } catch (error) {
                  console.error('Error al modificar el viaje:', error);
                }
              }
            }
          ]
        });
  
        await alert.present();
      } else {
        console.error('No se pudo obtener el ID del usuario desde LocalStorage.');
      }
    }
  }
  
  ActualizarMapa(viaje: any) {
    // Extraer las coordenadas del startPoint y endPoint del viaje
    const startPoint = [viaje.startPoint.longitude, viaje.startPoint.latitude];
    const endPoint = [viaje.endPoint.longitude, viaje.endPoint.latitude];
  
    // Llamas a la función para construir el trazado de la ruta con las nuevas coordenadas
    this.CrearTrazadoRuta(startPoint, endPoint);
  }

  async mostrarMensajeConfirmacion() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Usted ha aceptado el viaje.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  reverseGeocode(coordinates: number[]): Promise<void> {
    const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${environment.TOKEN}`;
    
    return fetch(reverseGeocodeUrl)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          this.nombreUbicacion = data.features[0].place_name;
          console.log('Nombre de la ubicación:', this.nombreUbicacion);
        } else {
          console.error('Error obteniendo nombre de ubicación: No hay resultados');
        }
      })
      .catch(error => {
        console.error('Error obteniendo nombre de ubicación:', error);
      });
  }

  ConstruirMapa() {
    var duoc = [-70.57906027403658, -33.59838997182398];
    this.map = new mapbox.Map({
      accessToken: environment.TOKEN,
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      zoom: 15,
      center: [duoc[0], duoc[1]],
    });

    const geocoder = new MapboxGeocoder({
      accessToken: environment.TOKEN,
      mapboxgl: mapbox,
    });

    const geocoderElement = document.getElementById('geocoder');
    if (geocoderElement) {
      geocoderElement.appendChild(geocoder.onAdd(this.map));

      geocoder.on('result', (e) => {
        this.startPoint = [duoc[0], duoc[1]];
        const endPoint = e.result.geometry.coordinates;
        this.endPoint = endPoint;

        const reverseGeocodeCoordinates = [endPoint[0], endPoint[1]];
        this.reverseGeocode(reverseGeocodeCoordinates).then(() => {
          console.log('Nombre de la ubicación:', this.nombreUbicacion);
        });

        this.CrearTrazadoRuta(duoc, endPoint);
      });
    } else {
      console.error("Elemento con ID 'geocoder' no encontrado.");
    }
  }

  CrearTrazadoRuta(startPoint: number[], endPoint: number[]) {
    fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${startPoint[0]},${startPoint[1]};${endPoint[0]},${endPoint[1]}?steps=true&geometries=geojson&access_token=${environment.TOKEN}`)
      .then(response => response.json())
      .then(data => {
        const route = data.routes[0].geometry;
        this.map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route,
          }
        });

        this.map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#888',
            'line-width': 8,
          },
        });

        console.log('Ruta construida con éxito.');
      })
      .catch(error => {
        console.error('Error obteniendo direcciones:', error);
      });
  }
}

