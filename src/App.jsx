import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for marker customization
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
    toilets: true,
    bikes: true,
    disabledParking: true,
    sports: true,
    hospitals: true,
    water: true,
    parks: true,
    food: true,
  });

  // Define different custom icons for each layer
  const getCustomIcon = (layer) => {
    // Convert layer name to lowercase to make it case-insensitive (optional)
    const layerName = layer.toLowerCase();
  
    console.log("Selected Layer for Icon: ", layerName); // Debugging: Log layer name
  
    let iconUrl = "";
  
    switch (layerName) {
      case "toilets":
        iconUrl = "icons/bike.png"; // Set correct path for toilet icon
        break;
      case "bikes":
        iconUrl = "icons/bike.png"; // Set correct path for bike icon
        break;
      case "parks":
        iconUrl = "icons/bike.png"; // Set correct path for park icon
        break;
      case "hospitals":
        iconUrl = "icons/bike.png"; // Set correct path for hospital icon
        break;
      case "food":
        iconUrl = "icons/bike.png"; // Set correct path for food icon
        break;
      // More cases can be added here
      default:
        iconUrl = "icons/toilet.png"; // Fallback icon if no match is found
    }
  
    return new L.Icon({
      iconUrl,
      iconSize: [32, 32], // Adjust size as needed
      iconAnchor: [16, 32], // Adjust anchor point
      popupAnchor: [0, -32], // Adjust popup anchor
    });
  };
  

  // Fetch local GeoJSON files for each dataset
  useEffect(() => {
    const fetchGeoJSON = async () => {
      const newData = {};
      for (const [key, datasetFile] of Object.entries(datasetLayers)) {
        try {
          const response = await fetch(`geojson/${datasetFile}`);
          const data = await response.json();
          console.log(`Fetched ${key} data:`, data); // Check if data is valid
          newData[key] = data;
        } catch (error) {
          console.error(`Error fetching ${key} data:`, error);
        }
      }
      setGeoJsonData(newData);
    };

    fetchGeoJSON();
  }, []);

  // Toggle Layers
  const toggleLayer = (layer) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Function to customize marker based on dataset
  const pointToLayer = (feature, latlng) => {
    const layerType = feature.properties.layer || "default";  // Fallback to 'default' if missing
    console.log("Layer Type: ", layerType); // Debugging: Check what layer is being passed
  
    const icon = getCustomIcon(layerType);  // Get custom icon based on the layer
    return L.marker(latlng, { icon });
  };
  

  return (
    <div className="relative h-screen w-screen">
      {/* Map Background (Ensure It’s Interactive) */}
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
              geoJsonData[layer].features?.length > 0 && ( // Ensure valid GeoJSON
                <GeoJSON
                  key={layer}
                  data={geoJsonData[layer]}
                  pointToLayer={pointToLayer} // Use pointToLayer to customize markers
                />
              )
          )}
        </MapContainer>
      </div>

      {/* Navigation Bar (Ensure It Doesn’t Block Map) */}
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
