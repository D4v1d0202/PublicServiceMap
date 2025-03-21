import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { useMap } from "./hooks/useMap";

const { VITE_USERNAME, VITE_STYLE_ID_1, VITE_STYLE_ID_2, VITE_ACCESS_TOKEN } = import.meta.env;

const datasetLayers = {
  toilets: "toilets_cgn.geojson",
  bikes: "bikes_cgn.geojson",
  disabledParking: "disabledParking_cgn.geojson",
  sports: "sports_cgn.geojson",
  hospitals: "hospitals_cgn.geojson",
  water: "water_cgn.geojson",
  parks: "parks_cgn.geojson",
  food: "food_cgn.geojson",
};

const MapComponent = ({ styleId, geoJsonData, activeLayers, applyFilters }) => {
  const { position } = useMap() || { position: [50.9375, 6.9603] };

  const onEachFeature = (feature, layer, dataType) => {
    if (feature.geometry && feature.geometry.coordinates) {
      const [lon, lat] = feature.geometry.coordinates;

      const street = feature.properties?.street || "Unknown Street";
      const number = feature.properties?.Nr ? ` ${feature.properties.Nr}` : "";
      const postcode = feature.properties?.Postagecode || "";
      const neighborhood = feature.properties?.neighborhood || "Unknown Neighborhood";

      const address = `${street}${number}, ${postcode} ${neighborhood}`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

      const formattedType = dataType.charAt(0).toUpperCase() + dataType.slice(1);

      layer.bindPopup(`
        <div>
          <strong>Type:</strong> ${formattedType} <br/>
          <strong>Address:</strong> ${address} <br/>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
      `);
    }
  };

  return (
    <MapContainer center={position} zoom={12} scrollWheelZoom={true} className="w-full h-[50vh]">
      <TileLayer
        attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        url={`https://api.mapbox.com/styles/v1/${VITE_USERNAME}/${styleId}/tiles/{z}/{x}/{y}?access_token=${VITE_ACCESS_TOKEN}`}
      />

      {/* Only render GeoJSON layers if applyFilters is true */}
      {applyFilters &&
        Object.keys(geoJsonData).map(
          (layer) =>
            activeLayers[layer] &&
            geoJsonData[layer] &&
            geoJsonData[layer].features?.length > 0 && (
              <GeoJSON
                key={layer}
                data={geoJsonData[layer]}
                onEachFeature={(feature, layerInstance) => onEachFeature(feature, layerInstance, layer)}
              />
            )
        )}
    </MapContainer>
  );
};

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState({});
  const [activeLayers, setActiveLayers] = useState(
    Object.keys(datasetLayers).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  useEffect(() => {
    const fetchGeoJSON = async () => {
      const newData = {};
      for (const [key, datasetFile] of Object.entries(datasetLayers)) {
        try {
          const response = await fetch(`geojson/${datasetFile}`);
          const data = await response.json();
          newData[key] = data;
        } catch (error) {
          console.error(`Error fetching ${key} data:`, error);
        }
      }
      setGeoJsonData(newData);
    };

    fetchGeoJSON();
  }, []);

  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center w-full">
        <h1 className="text-xl font-bold">Public Service Map von Köln</h1>

        {/* Filter Menu (Only Affects Second Map) */}
        <div className="bg-white p-3 rounded-lg shadow-md">
          <p className="font-bold text-gray-700">Filter Services (Map 2 only):</p>
          {Object.keys(datasetLayers).map((layer) => (
            <label key={layer} className="block text-sm text-gray-900">
              <input
                type="checkbox"
                checked={activeLayers[layer]}
                onChange={() => toggleLayer(layer)}
                className="mr-2"
              />
              {layer.charAt(0).toUpperCase() + layer.slice(1)}
            </label>
          ))}
        </div>
      </nav>

      {/* Map Section */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* First Map (No Data, Only TileLayer) */}
        <div className="w-full h-[50vh]">
          <h2 className="text-lg font-bold text-center">Map 1 (No Filter)</h2>
          <MapComponent styleId={VITE_STYLE_ID_1} geoJsonData={{}} activeLayers={{}} applyFilters={false} />
        </div>

        {/* Second Map (Filterable) */}
        <div className="w-full h-[50vh]">
          <h2 className="text-lg font-bold text-center">Map 2 (Filterable Layers)</h2>
          <MapComponent styleId={VITE_STYLE_ID_2} geoJsonData={geoJsonData} activeLayers={activeLayers} applyFilters={true} />
        </div>
      </div>
    </div>
  );
};

export default App;
