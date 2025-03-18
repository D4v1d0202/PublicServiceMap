import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useMap } from "./hooks/useMap";

const { VITE_USERNAME, VITE_STYLE_ID, VITE_ACCESS_TOKEN } = import.meta.env;

const App = () => {
  const { position } = useMap();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen">
      {/* Map Container (Background but Interactive) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <MapContainer
          center={position}
          zoom={10}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/${VITE_USERNAME}/${VITE_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${VITE_ACCESS_TOKEN}`}
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Navigation Bar (Above Map) */}
      <nav className="relative bg-blue-600 text-white p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold">Public Service Map von Köln</h1>

        {/* Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          >
            Services Filter
            <svg className="w-2.5 h-2.5 ml-3" aria-hidden="true" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-60 dark:bg-gray-700 dark:divide-gray-600 z-20">
              <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
                {[
                  "Public toilets",
                  "Rental bikes",
                  "Drinking water fountains",
                  "Parking lots",
                  "Public parks",
                  "Sport fields",
                  "Public food banks",
                ].map((item, index) => (
                  <li key={index}>
                    <label className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"/>
                      <span className="ml-2 text-sm">{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default App;
