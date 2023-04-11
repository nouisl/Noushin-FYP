import React, { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import Geocode from "react-geocode";

Geocode.setApiKey("AIzaSyDnQnlcNKS8Ris8LlRRZlt1cBEbZgxRVTE");

function EventMap({ events, google }) {
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    const getLocations = async () => {
      const newLocations = [];

      for (const event of events) {
        const address = `${event.venue}, ${event.city}`;

        try {
          const response = await Geocode.fromAddress(address);

          if (response && response.results && response.results[0].geometry) {
            const location = response.results[0].geometry.location;
            newLocations.push({ lat: location.lat, lng: location.lng });
          }
        } catch (error) {
          setError("There was an error fetching location information.");
        }
      }

      setLocations(newLocations);

      if (newLocations.length > 0) {
        const avgLat = newLocations.reduce((acc, loc) => acc + loc.lat, 0) / newLocations.length;
        const avgLng = newLocations.reduce((acc, loc) => acc + loc.lng, 0) / newLocations.length;
        setCenter({ lat: avgLat, lng: avgLng });
      }
    };

    getLocations();
  }, [events]);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : center ? (
        <Map 
          google={google} 
          containerStyle={{
            height: "calc(100vh - 140px)",
            position: "relative"
          }} 
          initialCenter={center} 
          center={center} 
          zoom={13} 
          disableDefaultUI={true}
        >
          {locations.map((location, index) => (
            <Marker key={index} position={location} />
          ))}
        </Map>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDnQnlcNKS8Ris8LlRRZlt1cBEbZgxRVTE",
})(EventMap);
