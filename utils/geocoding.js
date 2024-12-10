import axios from "axios";

// Use process.env to access the API key securely
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getLocationName(latitude, longitude) {
  // Ensure API key is available
  if (!GOOGLE_MAPS_API_KEY) {
    console.error("Google Maps API key is missing. Check your .env file.");
    return "Error Fetching Location";
  }

  // Validate latitude and longitude
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    console.error(
      `Invalid coordinates: latitude (${latitude}), longitude (${longitude})`
    );
    return "Invalid Coordinates";
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    console.log("Geocoding API Response:", response.data);

    // Check for valid results
    if (response.data.results && response.data.results.length > 0) {
      const firstResult = response.data.results[0];
      if (firstResult.geometry.location_type === "APPROXIMATE") {
        console.warn(
          "Approximate location detected:",
          firstResult.formatted_address
        );
      }

      // Fallback for partial matches
      const addressComponents = firstResult.address_components;
      const city = addressComponents.find((comp) =>
        comp.types.includes("locality")
      )?.long_name;
      const country = addressComponents.find((comp) =>
        comp.types.includes("country")
      )?.long_name;

      return city && country
        ? `${city}, ${country}`
        : firstResult.formatted_address;
    }

    console.warn("No results found for the given coordinates.");
    return "Unknown Location";
  } catch (error) {
    if (error.response) {
      console.error("Geocoding API Error Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from Geocoding API:", error.request);
    } else {
      console.error("Error setting up Geocoding API request:", error.message);
    }
    return "Error Fetching Location";
  }
}
