import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const SendData = async (data) =>{
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        window.alert("Signup Successfull");
        console.log('Registration successful!');
        navigate('/login');

      } else {
        window.alert("Signup Failed");
        console.error('Registration failed!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username: username,
      email: email,
      password: password
    };

    SendData(data);

    // Clear form fields after submission
    setUsername('');
    setEmail('');
    setPassword('');
  };

  function handleCallbackResponse (response){
    var userObject = jwtDecode(response.credential);
    const mydata = {
      username: userObject.given_name,
      email: userObject.email,
      password: userObject.sub
    }
    console.log(mydata);
    SendData(mydata);
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "104138030032-q5h5koc91og2qm4i7eqr68a4p69rfvem.apps.googleusercontent.com",
      callback: handleCallbackResponse
    })

    google.accounts.id.renderButton(
      document.getElementById("SignUpDiv"),
      {theme: "outline", size: "large"}
    );
  },[]);

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
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
        <button type="submit">Sign Up</button>
      </form>
      <div id = "SignUpDiv"></div>
    </div>
  );
};

export default Signup;
