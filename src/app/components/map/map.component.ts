import { AfterViewInit, Component, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { PLATFORM_ID, Inject } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { PlaceOfInterestComponent } from '../place-of-interest/place-of-interest.component';
import { PlaceOfInterestService } from '../../services/PlacesOfInterest.service';
import { PlaceOfInterest } from '../../models/place-of-interest.model';
import { SharedDataService } from '../../services/sharedData.service';
import { Route } from '../../models/route.model';
import { RouteService } from '../../services/Route.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [MenuComponent, PlaceOfInterestComponent],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnInit {

  place: PlaceOfInterest = new PlaceOfInterest();
  route: Route = new Route();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private placeOfInterestService: PlaceOfInterestService, private sharedDataService: SharedDataService, private routeService: RouteService) { }
  ngOnInit(): void {
    
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const map = L.map('map').setView([40.416896638534055, -3.703578185659524], 7);
      map.removeControl(map.zoomControl);
      L.control.zoom({ position: 'topright' }).addTo(map);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      //@ts-ignore
      var geocoder = L.Control.geocoder().addTo(map);

      let marker:any;

      // Escucha el evento click en el mapa
      map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
    
        // Si ya hay un marcador, elimínalo
        if (marker) {
            map.removeLayer(marker);
        }
    
        // Crea un nuevo marcador en las coordenadas del clic
        marker = L.marker([lat, lng]).addTo(map);
        this.place.lat = lat.toString();
        this.place.lon = lng.toString();
        this.placeOfInterestService.getAddressByCoordinates(this.place).subscribe((response) => {
            this.place.address = response.address;
            const popupContent = `
                <div>
                    <p>Latitud: ${this.place.lat}</p>
                    <p>Longitud: ${this.place.lon}</p>
                    <p>Dirección: ${this.place.address}</p>
                    <button id="saveButton">Guardar</button>
                    <button id="copyButton">Copiar</button>
                </div>
            `;
    
            // Configura el contenido del popup
            marker.bindPopup(popupContent);
    
            // Abre el popup
            marker.openPopup();
    
            // Agrega el listener para el botón guardar después de abrir el popup
            const saveButton = document.getElementById('saveButton');
            if (saveButton) {
              saveButton.addEventListener('click', () => {
                console.log('click');
                const savePlace: PlaceOfInterest = Object.assign({}, this.place);
                console.log(savePlace);
                this.sharedDataService.setPlaceOfInterest(savePlace);
              });
            }

            const copyButton = document.getElementById('copyButton');
            if (copyButton) {
              copyButton.addEventListener('click', () => {
                const coordinatesText = `${this.place.lat},${this.place.lon}`;
                this.copyToClipboard(coordinatesText);
              });
            }

            
              
            marker.on('popupclose', () => {
                  map.removeLayer(marker);
            });
        });
      });
      this.sharedDataService.route$.subscribe((routeSaved) => {
        if (routeSaved !== undefined && routeSaved !== null){
          //console.log('Id Ruta: ', typeof(routeSaved.id), ' Favorito: ', typeof(routeSaved.fav));

          this.route = routeSaved.route;
          if (this.route.geometry.length > 0) {
            const coordinates = this.route.geometry.map(coord => L.latLng(parseFloat(coord[1]),parseFloat(coord[0])));
            let polyline = L.polyline(coordinates, { color: 'blue' }).addTo(map);
            map.fitBounds(polyline.getBounds());
            const startMarker = L.marker(coordinates[0]).addTo(map!);
            const startPopupContent = `
              <div>
                <p>Distancia: ${this.route.distance}km</p>
                <p>Duración: ${this.route.duration}</p>
                ${!routeSaved.price !== null ? `<p>Coste: ${routeSaved.price}</p>` : ''}
                <button id="removeRoute">Quitar Ruta</button>
                ${!this.route.id ? `<button id="guardarRuta">Guardar Ruta</button>` : ''}
              </div>
            `;
            map.on('popupopen', () => {
              const saveButton = document.getElementById('guardarRuta');
              if (saveButton) {
                saveButton.addEventListener('click', () => {
                  const nameRoute = prompt('Introduce un nombre para la ruta:');
                  if (nameRoute) {
                    this.route.name = nameRoute;
                    this.routeService.saveRoute(this.route).subscribe(
                      (response) => {
                          console.log('Vehículo guardado:', response);
                      },
                      (error) => {
                          console.error('Error al guardar el vehículo:', error);
                          // Aquí puedes manejar el error si es necesario
                      }
                    );
                  }
                });
              }
              const removeButton = document.getElementById('removeRoute');
              if (removeButton) {
                removeButton.addEventListener('click', () => {
                  map.removeLayer(polyline);
                  map.removeLayer(startMarker);
                  map.closePopup();
                });
              }
            });
    startMarker.bindPopup(startPopupContent).openPopup();
          }
        }      
      });
      
    }
  }
  // Función para copiar texto al portapapeles
  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  
}
