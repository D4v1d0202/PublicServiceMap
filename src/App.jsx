import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useMap } from "./hooks/useMap";

const { VITE_USERNAME, VITE_STYLE_ID, VITE_ACCESS_TOKEN } = import.meta.env;

const App = () => {
  const { position } = useMap();
  return (
    <MapContainer
      center={position}
      zoom={4.5}
      scrollWheelZoom={true}
      style={{ minHeight: "100vh", minWidth: "100vw" }}
    >
      <TileLayer
        attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        url={`https://api.mapbox.com/styles/v1/${import.meta.env.VITE_USERNAME}/${import.meta.env.VITE_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_ACCESS_TOKEN}`}
/>
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

console.log(
  `https://api.mapbox.com/styles/v1/${import.meta.env.VITE_USERNAME}/${import.meta.env.VITE_STYLE_ID}/tiles/{z}/{x}/{y}?access_token=${import.meta.env.VITE_ACCESS_TOKEN}`
);


export default App;