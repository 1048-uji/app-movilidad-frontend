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
  errorMsg: string | null = null;
  carbTypeOptions: string[] = Object.values(CarbType);

  constructor(private vehicleService: VehicleService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
      this.loadVehicles(); 
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (data) => {
        this.vehicles = data;
        this.filteredVehicles = this.sortVehiclesByFavorite(data);
      },
      (error) => {
        console.error('Error al obtener los vehículos:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
  
  sortVehiclesByFavorite(vehicles: Vehicle[]): Vehicle[] {
    return vehicles.sort((a, b) => {
      if (a.fav && !b.fav) {
        return -1; 
      } else if (!a.fav && b.fav) {
        return 1; 
      } else {
        return 0; 
      }
    });
  }

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
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  showEditInput(vehicle: Vehicle) {
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
      this.errorMsg = null;
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  deleteVehicle(id: number){
    this.vehicleService.deleteVehicle(id).subscribe(
      () => {
        console.log('Éxito al eliminar:');
        this.loadVehicles();
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al eliminar', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
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
          this.errorMsg = null;
      },
      (error) => {
          console.error('Error al guardar el vehículo:', error);
          this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
}
