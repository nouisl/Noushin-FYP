// imports
import { useState, useEffect } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import Geocode from "react-geocode";

// set the API key for the Geocode library
Geocode.setApiKey(process.env.MAPS_API);

function EventMap({ events, google }) {
  // create state variables for locations, center, error, and zoom
  const [locations, setLocations] = useState([]);
  const [center, setCenter] = useState();
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(5);

  // update the zoom level when the events are filtered
  useEffect(() => {
    if (events.length > 3) {
      setZoom(4); 
    } else {
      setZoom(10); 
    }
  }, [events]);

  // fetch location information for each event using the Geocode library
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

      // calculate the average latitude and longitude values and update the center state
      if (newLocations.length > 0) {
        const avgLat = newLocations.reduce((acc, loc) => acc + loc.lat, 0) / newLocations.length;
        const avgLng = newLocations.reduce((acc, loc) => acc + loc.lng, 0) / newLocations.length;
        setCenter({ lat: avgLat, lng: avgLng });
      }
    };

    getLocations();
  }, [events]);
  
  // return a div containing either an error message, a map or a loading message
  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : center ? (
        <Map
          google={google}
          containerStyle={{
            height: "calc(100vh - 140px)",
            position: "relative",
          }}
          initialCenter={center}
          center={center}
          zoom={zoom}
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

// wrap the EventMap component in a GoogleApiWrapper with an API key
export default GoogleApiWrapper({
  apiKey: process.env.MAPS_API,
})(EventMap);
