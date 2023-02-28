import { Injectable } from '@angular/core';
import Leaflet from 'leaflet';
import { urlTemplate } from '../service/url-const.service';
import storageLayer from '../service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LeafletMapService {

  constructor() { }

  public static leafletMapMethod(map: any, lat: number, long: number) {
    if (!map)
      map = Leaflet.map('map').setView([22.3991033, -99.6069067], 16)

    //añade el mapa y ubica botones de guardado y borrado  
    let baseLayer = Leaflet.tileLayer
      .offline(urlTemplate, {
        attribution: 'Map data {attribution.OpenStreetMap}',
        subdomains: 'abc',
        minZoom: 13,
      }).addTo(map);

    map?.locate({ setView: true, enableHighAccuracy: true, maxZoom: 20 })
    let control
    if (!control) {
      control = Leaflet.control.savetiles(baseLayer, {
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
      control.addTo(map);
    }
    // layer switcher control
    let layerswitcher = Leaflet.control
      .layers({
        'OSM (offline)': baseLayer,
      }, null, { collapsed: false })
      .addTo(map);
    // add storage overlay
    storageLayer(baseLayer, layerswitcher);
  }

}
