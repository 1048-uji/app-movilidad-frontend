import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const requestBody = {
      email: this.email,
      password: this.password,
      username: this.username
    };

    this.http.post<any>('https://appmovilidad.onrender.com/auth/register', requestBody)
      .subscribe(response => {
        this.router.navigate(['/login']);
      });
  }
}
