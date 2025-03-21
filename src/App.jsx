import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { useMap } from "./hooks/useMap";

const { VITE_USERNAME, VITE_STYLE_ID, VITE_ACCESS_TOKEN } = import.meta.env;

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

const App = () => {
  const { position } = useMap() || { position: [50.9375, 6.9603] }; // Default to Cologne
  const [geoJsonData, setGeoJsonData] = useState({});
  const [activeLayers, setActiveLayers] = useState({
    toilets: false,
    bikes: false,
    disabledParking: false,
    sports: false,
    hospitals: false,
    water: false,
    parks: false,
    food: false,
  });

  // Fetch local GeoJSON files for each dataset
  useEffect(() => {
    const fetchGeoJSON = async () => {
      const newData = {};
      for (const [key, datasetFile] of Object.entries(datasetLayers)) {
        try {
          const response = await fetch(`geojson/${datasetFile}`);
          const data = await response.json();
          console.log(`Fetched ${key} data:`, data);
          newData[key] = data;
        } catch (error) {
          console.error(`Error fetching ${key} data:`, error);
        }
      }
      setGeoJsonData(newData);
    };

    fetchGeoJSON();
  }, []);

  // Function to create a popup with a Google Maps link
  const onEachFeature = (feature, layer, dataType) => {
    if (feature.geometry && feature.geometry.coordinates) {
      const [lon, lat] = feature.geometry.coordinates;
  
      // Construct address from available properties
      const street = feature.properties?.street || "Unknown Street";
      const number = feature.properties?.Nr ? ` ${feature.properties.Nr}` : "";
      const postcode = feature.properties?.Postagecode || "";
      const neighborhood = feature.properties?.neighborhood || "Unknown Neighborhood";
  
      const address = `${street}${number}, ${postcode} ${neighborhood}`;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  
      // Format type properly (capitalize first letter)
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
  
  

  // Toggle Layers
  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Map Background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <MapContainer
          center={position}
          zoom={12}
          scrollWheelZoom={true}
          className="pointer-events-auto"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/${VITE_USERNAME}/${VITE_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${VITE_ACCESS_TOKEN}`}
          />

          {/* Add layers dynamically */}
          {Object.keys(activeLayers).map(
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
      </div>

      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center z-10 absolute top-0 left-0 w-full">
        <h1 className="text-xl font-bold">Public Service Map von Köln</h1>

        {/* Filter Menu */}
        <div className="bg-white p-3 rounded-lg shadow-md">
          <p className="font-bold text-gray-700">Filter Services:</p>
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
    </div>
  );
};

export default App;
