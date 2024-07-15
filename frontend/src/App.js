import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header.js';
import CurrentLocation from './Components/CurrentLocation';
import HourlyForecast from './Components/HourlyForecast';
import DailyForecast from './Components/DailyForecast';
import YearlyOverview from './Components/YearlyOverview.js';
import Footer from "./Components/Footer";
import Signup from './Components/Signup';
import Signin from './Components/Signin';
import SavedLocations from './Components/SavedLocations';
import './App.css';

const App = () => {
  const [location, setLocation] = useState('');
  const token = localStorage.getItem('token');

  const handleSearch = (searchLocation) => {
    setLocation(searchLocation);
  };

  const handleSaveLocation = async (location) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://weather-app-shubham31.onrender.com/api/location', { location }, {
        headers: {
          'Authorization': token
        }
      });
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  useEffect(() => {
    const fetchDefaultLocation = async () => {
      try {
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ipData = ipResponse.data;
        const locationResponse = await axios.get(`https://ipinfo.io/${ipData.ip}/geo`);
        const locationInfo = locationResponse.data;
        setLocation(locationInfo.city);
      } catch (error) {
        console.error('Error fetching default location:', error);
      }
    };

    fetchDefaultLocation();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header setLocation={setLocation} onSearch={handleSearch} onSaveLocation={handleSaveLocation} />
        {token && (<SavedLocations onSelectLocation={setLocation} />)}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={
            <>
              <CurrentLocation location={location} />
              <HourlyForecast location={location} />
              <DailyForecast location={location} />
              <YearlyOverview location={location} />
            </>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
