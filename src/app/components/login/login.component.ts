import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  token: string = '';
  private apiUrl = 'https://appmovilidad.onrender.com';
  private testAPI = 'http://localhost:3000';


  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const requestBody = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(this.apiUrl+'/auth/login', requestBody)
      .subscribe(response => {
        this.token = response.token;
        sessionStorage.setItem('token', this.token);
        this.router.navigate(['/map']);
      }, error => {
        console.error('Error en la solicitud de inicio de sesión:', error);
      });
      
  }
}
