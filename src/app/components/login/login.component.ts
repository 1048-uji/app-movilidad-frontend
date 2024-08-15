import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  token: string = '';
  errorMsg: string | null = null;
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';


  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const requestBody = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>(this.testAPI+'/auth/login', requestBody)
      .subscribe(response => {
        this.token = response.token;
        sessionStorage.setItem('token', this.token);
        this.errorMsg = null;
        this.router.navigate(['/map']);
      }, error => {
        console.error('Error en la solicitud de inicio de sesión:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      });
      
  }
}
