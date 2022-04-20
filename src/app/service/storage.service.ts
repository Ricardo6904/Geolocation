import { Injectable } from '@angular/core';
import { getStorageInfo, getStoredTilesAsJson } from 'leaflet.offline';
import {urlTemplate} from '../service/url-const.service'
import Leaflet from 'leaflet'
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
}
export default function storageLayer(baseLayer, layerswitcher) {
  let layer;

  const getGeoJsonData = () => getStorageInfo(urlTemplate)
    .then((tiles) => getStoredTilesAsJson(baseLayer, tiles));

  const addStorageLayer = () => {
    getGeoJsonData().then((geojson) => {
      layer = Leaflet.geoJSON(geojson).bindPopup(
        (clickedLayer) => clickedLayer.feature.properties.key,
      );
      layerswitcher.addOverlay(layer, 'Offline tiles');
    });
  };

  addStorageLayer();

  baseLayer.on('storagesize', (e) => {
    document.getElementById('storage').innerHTML = e.storagesize;
    if (layer) {
      layer.clearLayers();
      getGeoJsonData().then((data) => {
        layer.addData(data);
      });
    }
  });
}