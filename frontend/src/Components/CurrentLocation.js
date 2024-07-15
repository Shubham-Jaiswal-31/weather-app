import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import './CurrentLocation.css';

const CurrentLocation = ({ location }) => {
  const [locationData, setLocationData] = useState({
    city: '',
    weather: '',
    temperature: '',
    humidity: '',
    windSpeed: '',
    dateTime: '',
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!location) return;

      try {
        const weatherResponse = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}`
        );
        const weatherData = weatherResponse.data;

        setLocationData({
          city: location,
          weather: weatherData.current.condition.text,
          temperature: weatherData.current.temp_c,
          humidity: weatherData.current.humidity,
          windSpeed: weatherData.current.wind_kph,
          dateTime: new Date().toLocaleString(),
        });
        setError(null);
      } catch (error) {
        setError('Error fetching location data.');
      }
    };

    fetchLocationData();
  }, [location]);

  return (
    <div className="current-location">
      <div className='content'>
        <h2>Current Location: {locationData.city}</h2>
        <div className="weather-info">
          <p>Weather: {locationData.weather}</p>
          <p>Temperature: {locationData.temperature} °C</p>
          <p>Humidity: {locationData.humidity}%</p>
          <p>Wind Speed: {locationData.windSpeed} m/s</p>
          <p>Date & Time: {locationData.dateTime}</p>
        </div>
      </div>
      <div className='weather-icons'>
        <i className="fa-solid fa-cloud"></i>
        <i className="fa-solid fa-sun"></i>
        <i className="fa-solid fa-bolt"></i>
        <i className="fa-solid fa-umbrella"></i>
        <i className="fa-solid fa-snowflake"></i>
        <i className="fa-solid fa-poo-storm"></i>
      </div>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default CurrentLocation;
