import { Component, NgZone } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Leaflet from 'leaflet';
import 'leaflet.offline';
import { urlTemplate } from '../service/url-const.service';
import storageLayer from '../service/storage.service';
import { Satellite } from 'satellite-count';
import {CapacitorBackgroundLocation,EVENTS,LOCATION_PRIORITY_ANDROID  } from 'capacitor-background-location';
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
  e:Event
  constructor(private ngZone: NgZone) { }
   

  ngOnInit() {
    this.watchCurrentPosition()
  }
  ionViewDidEnter() {
    this.leafletMap();
  }
  leafletMap() {
    //control de instanciación de mapa - cambiar coordenadas por zona cerca a usted
    if (!this.map)
      this.map = Leaflet.map('map').setView([22.3991033, -99.6069067], 16)


    //añade el mapa y ubica botones de guardado y borrado  
    let baseLayer = Leaflet.tileLayer
      .offline(urlTemplate, {
        attribution: 'Map data {attribution.OpenStreetMap}',
        subdomains: 'abc',
        minZoom: 13,
      }).addTo(this.map);

    this.map?.locate({ setView: true, enableHighAccuracy: true, maxZoom: 20 })

    if (!this.control) {
      this.control = Leaflet.control.savetiles(baseLayer, {
        zoomlevels: [13, 16], // niveles de zoom a guardar OJO: no exceder de 16 por políticas de uso de OSM
        confirm(layer, successCallback) {
          // eslint-disable-next-line no-alert
          if (window.confirm(`Guardar ${layer._tilesforSave.length}`)) {
            successCallback();
          }
        },
        confirmRemoval(layer, successCallback) {
          // eslint-disable-next-line no-alert
          if (window.confirm('Eliminar todos los mosaicos?')) {
            successCallback();
          }
        },
        saveText:
          '<ion-icon name="save-outline"></i>',
        rmText: '<ion-icon name="trash-outline"></i>',
      });
      this.control.addTo(this.map);

      // layer switcher control
      let layerswitcher = Leaflet.control
        .layers({
          'OSM (offline)': baseLayer,
        }, null, { collapsed: false })
        .addTo(this.map);
      // add storage overlay
      storageLayer(baseLayer, layerswitcher);
    }
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

  startBackgroundLocation = async () => {
    /*let a = CapacitorBackgroundLocation.start({interval:1000,locationPriority:LOCATION_PRIORITY_ANDROID.PRIORITY_HIGH_ACCURACY})
    console.log(a)*/
    CapacitorBackgroundLocation.addListener(EVENTS.Change,(pos)=>{
      console.log(pos)
    })
}



}
