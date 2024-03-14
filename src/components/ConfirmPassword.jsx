import React, { useState, useRef } from "react";
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function ConfirmPassword({ closeConfirmPassword, email}) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const [password, setPswd] = useState('');

  const handlePswdChange = (e) => {
    setPswd(e.target.value);
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    const myotp = otp.join('');
    const data = {
      otpCode: myotp,
      newpswd: password,
      email: email
    };
    console.log(data);
    //Object.assign(data, email);
    //console.log(data)
    try {
      const response = await fetch('http://localhost:5000/changepwd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        window.alert('Password Changed Successfully');
        console.log('Success');
        //navigate('/login');
      } 
      else {
        window.alert('Could not change password');
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle input change
  const handleChange = (index, e) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    if (e.target.value !== '' && index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  // Function to handle backspace key
  const handleBackspace = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputs.current[index - 1].focus();
    }
  };



  return (
    
      <div className='bg-purple-700 bg-opacity-40 rounded-xl flex flex-col justify-center align-center gap-2 text-center' style={{ height: '430px', width: '350px' }}>

          <div className='flex justify-end mt-3 mr-2'>
            <Link to="/forget-password">
              <button onClick={closeConfirmPassword} className='rounded-full bg-white p-2 text-black'>
                <XCircle size={25} />
              </button>
            </Link>
          </div>

        <form onSubmit={handleSubmitOtp} className="flex flex-col items-center">
          <div className="flex flex-row justify-center align-center gap-4">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                value={value}
                maxLength="1"
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleBackspace(index, e)}
                className="text-black w-10 h-10 rounded-sm border border-gray-300 text-center"
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 justify-center align-center text-center">
            <label className='text-2xl text-white mt-4'>New Password</label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              required
              onChange = {handlePswdChange}
              className="text-center text-black h-10 w-80 rounded-xl mr-5 ml-5"
            />

          <div className='flex justify-center'>
          <button className='bg-white text-black w-40 px-4 py-2 rounded-lg mb-10 ml-20'>Submit</button>
          </div>

          </div>
        </form>
      </div>

  );
}

export default ConfirmPassword;
