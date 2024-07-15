import './Signin.css';
import React, { useState} from 'react';
import  { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://weather-app-shubham31.onrender.com/api/auth/signin', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
      navigate(0);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form className='signin-form' onSubmit={handleSignin}>
      <h2>Sign In</h2>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;
