import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  token: string = '';
  errorMsg: string | null = null;
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';
  

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const requestBody = {
      username: this.username,
      password: this.password      
    };
    this.http.post<User>(this.testAPI+'/auth/register', requestBody)
      .subscribe(response => {
        const login: {email: string, password: string} = {email: response.email, password: requestBody.password}
        this.http.post<any>(this.testAPI+'/auth/login', login)
        .subscribe(response => {
            this.token = response.token;
            sessionStorage.setItem('token', this.token);
            this.errorMsg = null;
            this.router.navigate(['/map']);
          }, error => {
            console.error('Error en la solicitud de registro:', error);
            this.errorMsg = error.error.statusCode + ' ' + error.error.message;
        });
      });
  }
}
