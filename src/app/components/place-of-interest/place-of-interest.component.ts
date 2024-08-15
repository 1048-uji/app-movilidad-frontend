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
  errorMsg: string | null = null;

  constructor(private placeOfInterestService: PlaceOfInterestService, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
      this.loadPlacesOfInterest();
      this.sharedDataService.placeOfInterest$.subscribe((placeOfInterest) => {
        if (placeOfInterest !== undefined && placeOfInterest !== null){
          console.log(placeOfInterest)
          this.newPlace = placeOfInterest;
          this.showAddForm = true;
        }
        
      });
    }

  loadPlacesOfInterest() {
    this.placeOfInterestService.getPlacesOfInterest().subscribe(
      (data) => {
        this.placesOfInterest = data;
        this.errorMsg = null;
        this.filteredPlacesOfInterest = this.sortPlacesByFav(data);
      },
      (error) => {
        console.error('Error al obtener los lugares de interés:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }
  
  sortPlacesByFav(places: PlaceOfInterest[]): PlaceOfInterest[] {
    return places.sort((a, b) => {
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
      this.filteredPlacesOfInterest = (this.searchTerm === '' ? this.placesOfInterest : this.placesOfInterest.filter(place =>
        place.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      ));
  }

  toggleFavorite(place: PlaceOfInterest){
    place.fav = !place.fav;
    this.placeOfInterestService.toggleFavorite(place).subscribe(
      (response) => {
        this.loadPlacesOfInterest();
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
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
      this.errorMsg = null;
      this.loadPlacesOfInterest();
      },
      (error) => {
        console.error('Error al cambiar el estado de favorito:', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );
  }

  deletePlace(id: number){
    this.placeOfInterestService.deletePlace(id).subscribe(
      () => {
        console.log('Éxito al eliminar:');
        this.loadPlacesOfInterest();
        this.errorMsg = null;
      },
      (error) => {
        console.error('Error al eliminar', error);
        this.errorMsg = error.error.statusCode + ' ' + error.error.message;
      }
    );;
  }

  cancelSave(){
    this.newPlace= new PlaceOfInterest();
    this.showAddForm = false;
    this.errorMsg = null;
    this.sharedDataService.deletePlaceofInterest();
  }

  addPlace(place: PlaceOfInterest){
    if (place.lat && place.lon) {
      this.placeOfInterestService.addByCoordinates(place).subscribe(
          (response) => {
              console.log('Lugar guardado:', response);
              this.showAddForm = false;
              this.loadPlacesOfInterest()
              this.sharedDataService.deletePlaceofInterest()
              this.errorMsg = null;
          },
          (error) => {
              console.error('Error al guardar el lugar:', error);
              this.errorMsg = error.error.statusCode + ' ' + error.error.message;
          }
      );
  } else if (place.address) {
      this.placeOfInterestService.addByAddress(place).subscribe(
          (response) => {
              console.log('Lugar guardado:', response);
              this.showAddForm = false;
              this.loadPlacesOfInterest()
              this.sharedDataService.deletePlaceofInterest();
              this.errorMsg = null;
          },
          (error) => {
              console.error('Error al guardar el lugar:', error);
              this.errorMsg = error.error.statusCode + ' ' + error.error.message;
          }
      );
  } else {
      this.errorMsg = 'Se necesitan coordenadas o una dirección para guardar el lugar.';
  }
  }
}