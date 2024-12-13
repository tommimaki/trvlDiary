import React from "react";
import MapView from "@/components/mapView";

const MapPage = () => {
  return (
    <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">All Locations</h1>
      <MapView />
    </div>
  );
};

export default MapPage;
