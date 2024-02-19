import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

const ChangePswdForm = (props) => {
    const [otpcode, setOtp] = useState('');
    const [password, setPswd] = useState('');
    const navigate = useNavigate();

    const handleOtpChange = (e) => {
      setOtp(e.target.value);
    };

    const handlePswdChange = (e) => {
      setPswd(e.target.value);
    };

    const handleSubmitOtp = async (e) => {
      e.preventDefault();
      const data = {
        otpCode: otpcode,
        newpswd: password
      };
      Object.assign(data, props);
      try {
        const response = await fetch('/changepwd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          window.alert('Password Changed Successfully');
          console.log('Success');
          navigate('/login');
        } 
        else {
          window.alert('Could not change password');
          console.error(response.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmitOtp}>
        <div>
          <label htmlFor="otpcode">OTP:</label>
          <input
            type="text"
            id="otpcode"
            maxLength="4"
            autocomplete="off"
            value={otpcode}
            onChange={handleOtpChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePswdChange}
            required
          />
        </div>
        <button type="submit">Change Password</button>
      </form>    
        </div>
    );
  };
  
  export default ChangePswdForm;