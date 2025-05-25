import React from "react";

const MachineMap = ({ location, apiKey }) => {
  if (!location) return null;
  return (
    <div
      className="rounded-lg overflow-hidden border border-gray-200 h-[300px] w-full"
      dir="rtl"
    >
      <img
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
          location
        )}&zoom=10&size=400x300&markers=color:red%7C${encodeURIComponent(
          location
        )}&key=${apiKey}`}
        alt="خريطة الموقع"
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
};

export default MachineMap;
