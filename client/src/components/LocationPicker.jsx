import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon issue in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_POSITION = [30.0444, 31.2357]; // Cairo

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position}></Marker>;
}

const LocationPicker = ({ value, onChange }) => {
  const [position, setPosition] = useState(value || DEFAULT_POSITION);

  // Update parent when marker changes
  const handleSetPosition = (pos) => {
    setPosition(pos);
    if (onChange) onChange(pos);
  };

  return (
    <div>
      <MapContainer
        center={position}
        zoom={10}
        style={{ height: 300, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
      </MapContainer>
      <div className="mt-2 text-sm text-gray-700">
        الإحداثيات: {position[0].toFixed(5)}, {position[1].toFixed(5)}
      </div>
    </div>
  );
};

export default LocationPicker;
