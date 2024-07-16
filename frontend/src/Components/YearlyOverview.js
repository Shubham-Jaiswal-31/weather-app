import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ErrorMessage from './ErrorMessage';
import './YearlyOverview.css';

const YearlyOverview = ({ location }) => {
  const [yearlyData, setYearlyData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      const fetchYearlyData = async () => {
        try {
          const currentDate = new Date();
          const promises = [];
          for (let i = 0; i < 12; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const formattedDate = date.toISOString().split('T')[0];
            const url = `https://api.weatherapi.com/v1/history.json?key=${process.env.REACT_APP_WEATHER_API_KEY}&q=${location}&dt=${formattedDate}`;
            promises.push(axios.get(url));
          }

          const responses = await Promise.all(promises);
          const data = responses.map((response) => response.data.forecast.forecastday[0].day);

          const monthlyData = data.map((day, index) => ({
            month: new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1).toLocaleString('default', { month: 'long' }),
            avgTemp: day.avgtemp_c,
            humidity: day.avghumidity,
            uvIndex: day.uv,
            precipitation: day.totalprecip_mm,
          }));

          setYearlyData(monthlyData.reverse());
          setError(null);
        } catch (error) {
          setError('Error fetching location data.');
        } 
      };

      fetchYearlyData();
    }
  }, [location]);

  return (
    <div className="yearly-overview">
      <h2>Yearly Overview</h2>
      <div className="yearly-overview-table-container">
        <table className="yearly-overview-table">
          <thead>
            <tr>
              <th>Month</th>
              {yearlyData.map((monthData, index) => (
                <th key={index}>{monthData.month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Avg Temperature (°C)</td>
              {yearlyData.map((monthData, index) => (
                <td key={index}>{monthData.avgTemp}</td>
              ))}
            </tr>
            <tr>
              <td>Humidity (%)</td>
              {yearlyData.map((monthData, index) => (
                <td key={index}>{monthData.humidity}</td>
              ))}
            </tr>
            <tr>
              <td>UV Index</td>
              {yearlyData.map((monthData, index) => (
                <td key={index}>{monthData.uvIndex}</td>
              ))}
            </tr>
            <tr>
              <td>Precipitation (mm)</td>
              {yearlyData.map((monthData, index) => (
                <td key={index}>{monthData.precipitation}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default YearlyOverview;
