import { Component, Input, OnInit } from '@angular/core';
import { Vehicle, CarbType } from '../../models/vehicle.model';
import { VehicleService } from '../../services/Vehicle.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../services/sharedData.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  searchTerm: string = '';
  vehicles: Vehicle[] = [new Vehicle()];
  filteredVehicles: Vehicle[] = [];
  showEditForm: boolean = false;
  newName: string = '';
  showAddForm: boolean = false;
  newVehicle = new Vehicle();
  editingVehicle: Vehicle = new Vehicle();
  errorMsg: string = '';
  carbTypeOptions: string[] = Object.values(CarbType);

  constructor(private vehicleService: VehicleService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
      this.loadVehicles(); 
  }

  // Método para cargar los vehículos del usuario desde el backend
  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (data) => {
        this.vehicles = data;
        this.filteredVehicles = this.sortVehiclesByFavorite(data); // Ordenar por vehicle.favorite
      },
      (error) => {
        console.error('Error al obtener los vehículos:', error);
      }
    );
  }
  
  sortVehiclesByFavorite(vehicles: Vehicle[]): Vehicle[] {
    // Ordenar por vehicle.favorite, colocando los favoritos primero
    return vehicles.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1; // a es favorito, b no es favorito, a debe ir antes que b
      } else if (!a.fav && b.fav) {
        return 1; // b es favorito, a no es favorito, b debe ir antes que a
      } else {
        return 0; // Ambos son favoritos o ambos no son favoritos, no es necesario cambiar el orden
      }
    });
  }

  // Método de búsqueda
  search() {
      this.filteredVehicles = (this.searchTerm === '' ? this.vehicles : this.vehicles.filter(vehicle =>
        vehicle.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      ));
  }

  toggleFavorite(vehicle: Vehicle){
    vehicle.fav = !vehicle.fav;
    this.vehicleService.toggleFavorite(vehicle).subscribe(
      (response) => {
        this.loadVehicles();
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        // Manejar errores aquí
      }
    );
  }

  showEditInput(vehicle: Vehicle) {
    // Asignar el vehículo que se está editando y mostrar el formulario de edición
    this.editingVehicle = vehicle;
    this.showEditForm = true;
}

  editVehicle(vehicle: Vehicle): void {
    console.log("editando vehículo", vehicle);
    this.vehicleService.editVehicle(vehicle).subscribe((response) =>{
      this.editingVehicle = new Vehicle();
      this.loadVehicles();
      this.newVehicle = new Vehicle();
      this.editingVehicle = new Vehicle();
      this.showAddForm = false;
      this.showEditForm = false;
      this.errorMsg = '';
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        // Manejar errores aquí
      }
    );
  }

  deleteVehicle(id: number){
    this.vehicleService.deleteVehicle(id).subscribe(
      () => {
        console.log('Éxito al eliminar:');
        this.loadVehicles();
        // Realizar acciones adicionales si es necesario
      },
      (error) => {
        console.error('Error al eliminar', error);
        // Manejar errores aquí
      }
    );
  }

  cancelSave() {
    this.newVehicle = new Vehicle();
    this.editingVehicle = new Vehicle();
    this.showAddForm = false;
    this.showEditForm = false;
    this.errorMsg = '';
}

  addVehicle(vehicle: Vehicle){
    this.vehicleService.addVehicle(vehicle).subscribe(
      (response) => {
          console.log('Vehículo guardado:', response);
          this.showAddForm = false;
          this.loadVehicles();
          this.errorMsg='';
      },
      (error) => {
          console.error('Error al guardar el vehículo:', error);
          // Aquí puedes manejar el error si es necesario
      }
    );
  }
}
