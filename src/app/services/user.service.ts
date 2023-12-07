import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'https://server-d6bu.onrender.com';

  constructor(private http: HttpClient) { }

  // Registrar un usuario
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.url}/users`, user);
  }

  verifyUser(nombre: string, contrasena: string): Observable<User | null> {
    // Realiza una solicitud GET a la ruta /users con parámetros de consulta
    return this.http.get<User[]>(`${this.url}/users?nombre=${nombre}&contrasena=${contrasena}`)
      .pipe(
        map(users => (users.length > 0) ? users[0] : null)
      );
    
  }

  updateUser(id: number, user: User): Observable<User> {
    const updateUserUrl = `${this.url}/users/${id}`;
    return this.http.put<User>(updateUserUrl, user);
  }

  registerAuto(autoData: any): Observable<any> {
    // Enviar la solicitud POST para registrar el auto en la base de datos
    return this.http.post<any>(`${this.url}/auto`, autoData);
  }

  deleteProfile(id: number) {
    return this.http.delete(`${this.url}/users/${id}`);
  }

  deleteAuto(user_id: number) {
    return this.http.delete(`${this.url}/auto/?user_id=${user_id}`);
  }

  registrarViaje(viajeData: any): Observable<any> {
    return this.http.post<any>(`${this.url}/viaje`, viajeData);
  }

  // Actualizar un viaje
  actualizarViaje(id: number, viajeData: any): Observable<any> {
    const actualizarViajeUrl = `${this.url}/viaje/${id}`;
    return this.http.put<any>(actualizarViajeUrl, viajeData);
  }

  getTodosViajesDisponibles(): Observable<any[]> {
    const url = `${this.url}/viaje?servicioTomado=false`;
    return this.http.get<any[]>(url);
  }

  getUserById(userId: number): Observable<User> {
    const url = `${this.url}/users/${userId}`;
    console.log('URL de la solicitud:', url);
    return this.http.get<User>(url).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError('Error al obtener información del usuario');
      })
    );
  }


  modificarViaje(id: number, usuarioId: number): Observable<any> {
    const modificarViajeUrl = `${this.url}/viaje/${id}`;

    return this.http.get<any>(modificarViajeUrl).pipe(
      catchError((error) => {
        console.error('Error en la solicitud HTTP:', error);
        return throwError('Error al obtener información del viaje');
      }),
      switchMap((viaje) => {
        viaje.servicioTomado = true;
        viaje.choferId = usuarioId;  // Agregar el ID del usuario que toma el viaje

        return this.http.put<any>(modificarViajeUrl, viaje);
      })
    );
  }

  hasAuto(userId: number): Observable<boolean> {
    const url = `${this.url}/auto?user_id=${userId}`;
    return this.http.get<any[]>(url).pipe(
      map(autos => autos.length > 0)
    );
  }
}
