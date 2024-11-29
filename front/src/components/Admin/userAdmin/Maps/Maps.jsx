import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const Maps = ({ users, setMarked }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {

    const fetchCoordinates = async () => {
      const addresses = users.map(user => user.address);
      //console.log('Addresses:', addresses); // Log addresses for debugging

      const promises = addresses.map(async (address) => {
        // Check for empty or invalid addresses
        if (!address) {
         // console.error(`Invalid address: ${address}`);
          return null; // Skip invalid addresses
        }

        // Encode address to ensure it's formatted correctly for the API request
        const encodedAddress = encodeURIComponent(address);
        //console.log(`Fetching coordinates for: ${encodedAddress}`);

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                address: encodedAddress,
                key: 'AIzaSyBdCptM7A2gWj7AOSkljFe_j9elF7AMPM4',  // **Geocoding API Key**
              },
            }
          );

          // Log the response to check for errors or missing data
          //console.log('Geocoding API Response:', response.data);

          // Check if the response contains results
          const location = response.data.results[0]?.geometry.location;
          if (!location) {
            //console.error(`No location found for ${address}`);
            return null;
          }

          return { address, ...location };
        } catch (error) {
          //console.error(`Error fetching geocode data for ${address}:`, error.message);
          return null;
        }
      });

      // Resolve all geocode requests and filter out any null results
      const results = await Promise.all(promises);
      const validLocations = results.filter((location) => location !== null);

      setLocations(validLocations);
      //console.log('Locations:', validLocations);
    };

    fetchCoordinates();
  }, [users]); // Add users as a dependency

  // Function to handle marker click and log the user details
  function handleMarkerClick(user) {
    setMarked(user);
  }

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBdCptM7A2gWj7AOSkljFe_j9elF7AMPM4" // **Maps JavaScript API Key**
    >
      <GoogleMap
        mapContainerStyle={{ width: '600px', height: '450px' }}
        center={locations[0] || { lat: 37.7749, lng: -122.4194 }} // Center on the first location or a default
        zoom={10}
      >
        {locations.map((location, index) => {
          // Find the user corresponding to the location
          const user = users.find(user => user.address === location.address);

          return (
            <Marker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              title={location.address}
              onClick={() => handleMarkerClick(user)} // Pass user details to the click handler
            />
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default Maps;


