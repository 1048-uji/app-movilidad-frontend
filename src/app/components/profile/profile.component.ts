import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/User.service'
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../services/Vehicle.service';
import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = new User();
  editMode = false;
  showPasswordConfirm = false;
  password: string = '';
  passwordError: string = '';
  vehicles: Vehicle[] = [new Vehicle()];
  filteredVehicles: Vehicle[] = [];
  routeOptions = [
    { value: 'fast', label: 'Rápida' },
    { value: 'recommended', label: 'Recomendada' },
    { value: 'short', label: 'Corta' }
];

  constructor(private userService: UserService, private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadVehicles()
  }

  loadUserProfile(): void {
    this.userService.getUser().subscribe(
      (data: User) => {
        this.user = data;
        console.log(data)
      },
      (error) => {
        console.error('Error loading user profile', error);
      }
    );
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (data) => {
        this.vehicles = data;
        this.filteredVehicles = this.sortVehiclesByFavorite(data, this.user.vehicleDefault); // Ordenar por vehicle.favorite
      },
      (error) => {
        console.error('Error al obtener los vehículos:', error);
      }
    );
  }

  sortVehiclesByFavorite(vehicles: Vehicle[], defaultVehicle: Vehicle | undefined): Vehicle[] {
    // Ordenar por vehicle.favorite, colocando los favoritos primero
    vehicles.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1; // a es favorito, b no es favorito, a debe ir antes que b
      } else if (!a.fav && b.fav) {
        return 1; // b es favorito, a no es favorito, b debe ir antes que a
      } else {
        return 0; // Ambos son favoritos o ambos no son favoritos, no es necesario cambiar el orden
      }
    });

    // Encontrar el índice del vehículo predeterminado por su ID
    if(defaultVehicle)
    {
      const defaultVehicleIndex = vehicles.findIndex(vehicle => vehicle.id === defaultVehicle.id);
      if (defaultVehicleIndex !== -1) {
        // Mover el vehículo predeterminado al principio del array
        const defaultVehicle = vehicles.splice(defaultVehicleIndex, 1)[0];
        vehicles.unshift(defaultVehicle);
      }
    }

    return vehicles;
}

  confirmPassword(): void {
    this.showPasswordConfirm = true;
    console.log("Confirm Password")
  }

  checkPassword(): void {
    this.userService.verifyPassword(this.password).subscribe(
      (response) => {
        if (response === true) {
          this.showPasswordConfirm = false;
          this.editMode = true;
        } else {
          this.passwordError = 'Contraseña incorrecta';
        }
      },
      (error) => {
        this.passwordError = 'Error al verificar la contraseña';
      }
    );
  }

  updateProfile(): void {
    this.userService.updateUserProfile(this.user).subscribe(
      (response) => {
        this.editMode = false;
        this.loadUserProfile();
      },
      (error) => {
        // Manejar el error
      }
    );
  }
}
