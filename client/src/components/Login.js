import React, { useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import env from "react-dotenv";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const SendData = async (data) =>{
    try {
      const response = await fetch('/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.alert("Login Successfull");
        console.log('Login successful!');
        navigate('/welcome');

      } else {
        window.alert("Login Failed");
        console.error('Login failed!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: email,
      password: password
    };
    SendData(data);
    // Clear form fields after submission
    setEmail('');
    setPassword('');
  };

  function handleCallbackResponse (response){
    var userObject = jwtDecode(response.credential);
    const mydata = {
      email: userObject.email,
      password: userObject.sub
    }
    console.log(mydata);
    SendData(mydata);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: env.client_id,
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("LoginDiv"),
      {theme: "outline", size: "large"}
    );
  },[]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/forgot-password">Forgot Password</Link>
      <div id = "LoginDiv"></div>
    </div>
  );
};

export default Login;
