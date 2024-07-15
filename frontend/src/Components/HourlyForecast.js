import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import './HourlyForecast.css';

const HourlyForecast = ({ location }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      const fetchHourlyData = async () => {
        try {
          const response = await axios.get(
            `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&hours=24`
          );
          const data = response.data.forecast.forecastday[0].hour.filter((_, index) => index % 2 === 0);

          setHourlyData(data);
          setError(null);
        } catch (error) {
          setError('Error fetching hourly data.');
        }
      };

      fetchHourlyData();
    }
  }, [location]);

  return (
    <div className="hourly-forecast">
      <h2>Hourly Forecast</h2>
      <div className="hourly-forecast-table-container">
        <table className="hourly-forecast-table">
          <thead>
            <tr>
              <th>Time</th>
              {hourlyData.map((hour, index) => (
                <th key={index}>{new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Condition</td>
              {hourlyData.map((hour, index) => (
                <td key={index}><img src={hour.condition.icon} alt={hour.condition.text}></img></td>
              ))}
            </tr>
            <tr>
              <td>Temperature (°C)</td>
              {hourlyData.map((hour, index) => (
                <td key={index}>{hour.temp_c}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>
  );
};


export default HourlyForecast;
