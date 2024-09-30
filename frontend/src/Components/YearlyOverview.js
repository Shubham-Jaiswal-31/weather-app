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
          const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1).toISOString().split('T')[0]; // Start of the month
          const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0).toISOString().split('T')[0]; // End of the month
          const ipResponse = await axios.get('https://api.ipify.org?format=json');
          const ip = ipResponse.data.ip;
          const coor = await axios.get(`http://ip-api.com/json/${ip}`);
          const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coor.data.lat}&longitude=${coor.data.lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,relative_humidity_2m_mean&timezone=auto`;
          promises.push(axios.get(url));
        }

        const responses = await Promise.all(promises);
        const data = responses.map((response) => response.data.daily);

        const monthlyData = data.map((day, index) => ({
          month: new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1).toLocaleString('default', { month: 'long' }),
          avgTemp: Number(((day.temperature_2m_max[0] + day.temperature_2m_min[0]) / 2).toFixed(2)), // Average of max and min temp
          humidity: day.relative_humidity_2m_mean[0],
          uvIndex: day.uv_index_max[0],
          precipitation: day.precipitation_sum[0],
        }));

        setYearlyData(monthlyData.reverse());
        setError(null);
      } catch (error) {
        setError('Error fetching location data.');
        console.log(error);
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
