import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { PlaceOfInterest } from '../../models/place-of-interest.model';
import { PlaceOfInterestService } from '../../services/PlacesOfInterest.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../../services/sharedData.service';
@Component({
  selector: 'app-place-of-interest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-of-interest.component.html',
  styleUrl: './place-of-interest.component.css'
})
export class PlaceOfInterestComponent implements OnInit {
  searchTerm: string = '';
  placesOfInterest: PlaceOfInterest[] = [new PlaceOfInterest()];
  filteredPlacesOfInterest: PlaceOfInterest[] = [];
  showEditpop: boolean = false;
  newName: string = '';
  editingPlace: PlaceOfInterest = new PlaceOfInterest();
  showAddForm: boolean = false;
  newPlace= new PlaceOfInterest();
  errorMsg: string = '';

  constructor(private placeOfInterestService: PlaceOfInterestService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
      this.loadPlacesOfInterest(); // Método para cargar los lugares de interés del usuario
      this.sharedDataService.placeOfInterest$.subscribe((placeOfInterest) => {
        if (placeOfInterest !== undefined && placeOfInterest !== null){
          console.log(placeOfInterest)
          this.newPlace = placeOfInterest;
          this.showAddForm = true;
        }
        
      });
    }

  // Método para cargar los lugares de interés del usuario desde el backend
  loadPlacesOfInterest() {
    this.placeOfInterestService.getPlacesOfInterest().subscribe(
      (data) => {
        this.placesOfInterest = data;
        this.filteredPlacesOfInterest = this.sortPlacesByFav(data); // Ordenar por place.fav
      },
      (error) => {
        console.error('Error al obtener los lugares de interés:', error);
      }
    );
  }
  
  sortPlacesByFav(places: PlaceOfInterest[]): PlaceOfInterest[] {
    // Ordenar por place.fav, colocando los favoritos primero
    return places.sort((a, b) => {
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
      this.filteredPlacesOfInterest = (this.searchTerm === '' ? this.placesOfInterest : this.placesOfInterest.filter(place =>
        place.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      ));
  }

  toggleFavorite(place: PlaceOfInterest){
    place.fav = !place.fav;
    this.placeOfInterestService.toggleFavorite(place).subscribe(
      (response) => {
        this.loadPlacesOfInterest();
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        // Manejar errores aquí
      }
    );
  }

  showEditInput(place: PlaceOfInterest): void {
    this.showEditpop = true;
    this.editingPlace = place;
  }

  editPlace(name: string): void {
    this.newName='';
    this.showEditpop = false;
    this.editingPlace.name = name;
    console.log("editando lugar", this.editingPlace);
    this.placeOfInterestService.editPlace(this.editingPlace).subscribe((response) =>{
      this.editingPlace = new PlaceOfInterest()
      this.loadPlacesOfInterest();
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        // Manejar errores aquí
      }
    );
  }

  deletePlace(id: number){
    this.placeOfInterestService.deletePlace(id).subscribe(
      () => {
        console.log('Éxito al eliminar:');
        this.loadPlacesOfInterest();
        // Realizar acciones adicionales si es necesario
      },
      (error) => {
        console.error('Error al eliminar', error);
        // Manejar errores aquí
      }
    );;
  }

  cancelSave(){
    this.newPlace= new PlaceOfInterest();
    this.showAddForm = false;
    this.errorMsg = '';
    this.sharedDataService.deletePlaceofInterest();
  }

  addPlace(place: PlaceOfInterest){
    if (place.lat && place.lon) {
      // Si existen las coordenadas, llama al método addByCoordinates del servicio
      this.placeOfInterestService.addByCoordinates(place).subscribe(
          (response) => {
              console.log('Lugar guardado:', response);
              this.showAddForm = false;
              this.loadPlacesOfInterest()
              this.sharedDataService.deletePlaceofInterest()
              this.errorMsg='';
          },
          (error) => {
              console.error('Error al guardar el lugar:', error);
              // Aquí puedes manejar el error si es necesario
          }
      );
  } else if (place.address) {
      // Si no hay coordenadas pero hay dirección, llama al método addByAddress del servicio
      this.placeOfInterestService.addByAddress(place).subscribe(
          (response) => {
              console.log('Lugar guardado:', response);
              this.showAddForm = false;
              this.loadPlacesOfInterest()
              this.sharedDataService.deletePlaceofInterest();
              this.errorMsg = '';
          },
          (error) => {
              console.error('Error al guardar el lugar:', error);
              // Aquí puedes manejar el error si es necesario
          }
      );
  } else {
      // Si no hay ni coordenadas ni dirección, muestra un mensaje de error en el HTML
      this.errorMsg = 'Se necesitan coordenadas o una dirección para guardar el lugar.';
  }
  }
}