import React, { useState } from 'react';
import  { useNavigate } from 'react-router-dom';
import './Header.css';
import logo from './logo.svg';

const Header = ({ onSearch, onSaveLocation }) => {
  const [location, setLocation] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (location) {
      onSearch(location);
    } else {
      alert('Please enter a location.');
    }
  };

  const handleSaveLocation = () => {
    if (location) {
      onSaveLocation(location);
      navigate('/');
      navigate(0);
    } else {
      alert('Please enter a location.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    navigate(0);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="title">Weather App</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="input"
          />
          <button onClick={handleSearch} className="button">
            Search
          </button>
          {token ? (
            <div className='var-btns'>
              <button onClick={handleSaveLocation} className="button">
                Save Location
              </button>
              <button onClick={handleLogout} className="button">
                Logout
              </button>
            </div>
          ): (
            <div className='var-btns'>
              <button className="button" onClick={() => window.location.href='/signup'}>
                Sign Up
              </button>
              <button className="button" onClick={() => window.location.href='/signin'}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
