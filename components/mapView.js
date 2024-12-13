"use client";
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const MapView = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Replace with your API key
  });

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/entries");
        if (!res.ok) throw new Error("Failed to fetch locations");

        const data = await res.json();
        console.log("Fetched Data:", data);

        // Parse and filter locations
        const parsedLocations = data.entries
          .filter((entry) => entry.latitude && entry.longitude)
          .map((entry) => ({
            id: entry._id,
            title: entry.title,
            latitude: entry.latitude,
            longitude: entry.longitude,
            locationName: entry.locationName,
            imageUrl: entry.imageUrl,
          }));

        setLocations(parsedLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={{ lat: 0, lng: 0 }}
      zoom={2} // World view
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.latitude, lng: location.longitude }}
          onClick={() => setSelectedLocation(location)}
        />
      ))}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: selectedLocation.latitude,
            lng: selectedLocation.longitude,
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div>
            <h3 className="text-black">{selectedLocation.title}</h3>
            <p className="text-black">{selectedLocation.locationName}</p>
            <Image
              src={selectedLocation.imageUrl}
              alt={selectedLocation.title}
              priority
              width={100} // Specify width
              height={60} // Specify height
              style={{ borderRadius: "8px", objectFit: "cover" }}
            />
            <Link
              href={`/entries/${selectedLocation.id}`}
              className="text-blue-500 hover:underline"
            >
              See Entry
            </Link>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapView;
