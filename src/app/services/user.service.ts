import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../models/user.interface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = 'http://localhost:3000';

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



}
