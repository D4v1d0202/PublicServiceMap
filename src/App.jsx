import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useMap } from "./hooks/useMap";

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
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default App;