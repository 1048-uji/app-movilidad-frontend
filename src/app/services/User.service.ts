import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';
  private using = this.apiUrl;

  constructor(private http: HttpClient) { }

  getUser(){
    return this.http.get<User>(`${this.using}/user`);
  }

  verifyPassword(password: string){
    return this.http.post<boolean>(`${this.using}/auth/verifyPassword`,{"password":password});
  }

  updateUserProfile(user: User){
    return this.http.put<User>(`${this.using}/user`, user);
  }


}