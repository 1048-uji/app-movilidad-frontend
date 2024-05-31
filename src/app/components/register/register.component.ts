import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  token: string = '';
  

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const requestBody = {
      email: this.email,
      password: this.password,
      username: this.username
    };
//https://appmovilidad.onrender.com/auth/register
    this.http.post<User>('https://appmovilidad.onrender.com/auth/register', requestBody)
      .subscribe(response => {
        const login: {email: string, password: string} = {email: response.email, password: requestBody.password}
        this.http.post<any>('https://appmovilidad.onrender.com/auth/login', login)
        .subscribe(response => {
            this.token = response.token;
            sessionStorage.setItem('token', this.token);
            this.router.navigate(['/map']);
          }, error => {
            console.error('Error en la solicitud de inicio de sesión:', error);
        });
      });
  }
}
