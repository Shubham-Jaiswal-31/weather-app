import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  { useNavigate } from 'react-router-dom';
import './SavedLocations.css';

const SavedLocations = ({ onSelectLocation }) => {
  const [locationData, setLocationData] = useState([]);
  const navigate = useNavigate();

  const handleDeleteLocation = async (locationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://weather-app-shubham31.onrender.com/api/location/${locationId}`, {
        headers: {
          'Authorization': token
        }
      });
      navigate('/');
      navigate(0);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedLocationsResponse = await axios.get('https://weather-app-shubham31.onrender.com/api/location', {
          headers: {
            'Authorization': token
          }
        });
        const savedLocations = savedLocationsResponse.data;
        const data = await Promise.all(savedLocations.map(async (location) => {
          const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location.name}`);
          return { ...response.data, id: location._id };
        }));
        setLocationData(data);
      } catch (error) {
        console.error('Error fetching saved locations or weather data:', error);
      }
    };
  
    fetchWeatherData();
  }, []);
  

  return (
    <div className="saved-locations">
      {locationData.map((location) => (
        <div className="card" key={location.id} onClick={() => onSelectLocation(location.location.name)}>
          <h3>{location.location.name}</h3>
          <div className='card-img-p'>
            <img src={location.current.condition.icon} alt={location.current.condition.text}></img>
            <p>{location.current.temp_c} °C</p>
          </div>
          <p>{location.current.humidity}% Humidity</p>
          <button onClick={() => handleDeleteLocation(location.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default SavedLocations;
