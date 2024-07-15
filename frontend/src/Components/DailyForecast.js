import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import './DailyForecast.css';

const DailyForecast = ({ location }) => {
  const [dailyData, setDailyData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      const fetchDailyData = async () => {
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&days=7`
          );
          const data = response.data.forecast.forecastday;

          setDailyData(data);
          setError(null);
        } catch (error) {
          setError('Error fetching location data.');
        }
      };

      fetchDailyData();
    }
  }, [location]);

  return (
    <div className="daily-forecast">
      <h2>Daily Forecast</h2>
      <div className="daily-forecast-table-container">
        <table className="daily-forecast-table">
          <thead>
            <tr>
              <th>Day</th>
              {dailyData.map((day, index) => (
                <th key={index}>{new Date(day.date).toLocaleString('en-us', {  weekday: 'long' })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Condition</td>
              {dailyData.map((day, index) => (
                <td key={index}><img src={day.day.condition.icon} alt={day.day.condition.text}></img></td>
              ))}
            </tr>
            <tr>
              <td>Max Temp (°C)</td>
              {dailyData.map((day, index) => (
                <td key={index}>{day.day.maxtemp_c}</td>
              ))}
            </tr>
            <tr>
              <td>Min Temp (°C)</td>
              {dailyData.map((day, index) => (
                <td key={index}>{day.day.mintemp_c}</td>
              ))}
            </tr>
            <tr>
              <td>Humidity (%)</td>
              {dailyData.map((day, index) => (
                <td key={index}>{day.day.avghumidity}</td>
              ))}
            </tr>
            <tr>
              <td>Wind Speed (kph)</td>
              {dailyData.map((day, index) => (
                <td key={index}>{day.day.maxwind_kph}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default DailyForecast;
