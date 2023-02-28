import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Leaflet from 'leaflet';
import 'leaflet.offline';
import { urlTemplate } from '../service/url-const.service';
import storageLayer from '../service/storage.service';
import { Satellite } from 'satellite-count';
import { CapacitorBackgroundLocation, EVENTS } from 'capacitor-background-location';
import { LeafletMapService } from '../service/leaflet-map.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  map: any; control: any; circle: any; latitud: any; longitud: any; altitud: any = 0
  pluginOutPut: any;
  result: any = 0;
  outPut: any;
  loc: any;
  e: Event
  constructor(private ngZone: NgZone) { }


  ngOnInit() {
    this.watchCurrentPosition()
  }
  ionViewDidEnter() {
    //this.leafletMap();
    LeafletMapService.leafletMapMethod(this.map, this.latitud, this.longitud)
  }

  watchCurrentPosition = async () => {
    try {
      Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 100, maximumAge: 200 }, (position, err) => {
        this.ngZone.run(() => {
          if (err) { console.log('Error:', err); return; }

          //asignación de valores
          this.ubicarMapa(position.coords.latitude, position.coords.longitude)
          this.latitud = position.coords.latitude
          this.longitud = position.coords.longitude
          this.altitud = position.coords.altitude

        })
        this.runNativeCode()

      })
    } catch (error) {
      console.log("Error Watch: " + error)
    }
  }
  /**
   * Requiere latitud/longitud
   * Marca un círculo en el mapa en tiempo real, se actualiza con cada iteración
   */
  ubicarMapa(latitud: number, longitud: number) {
    if (this.circle)
      this.map?.removeLayer(this.circle)

    this.circle = Leaflet.circle([latitud, longitud], {
      fillColor: '#0000FF',
      fillOpacity: 1,
      radius: 5,
      stroke: false
    })
    this.map?.addLayer(this.circle)


  }
  async runNativeCode() {
    this.pluginOutPut = await Satellite.runNativeCode({ name: 'Android' })
    this.result = this.pluginOutPut.result
  }


}




