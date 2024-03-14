import React, { useState, useRef } from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import ConfirmPassword from './ConfirmPassword';

function ForgetPassword({ closePassword }) {
  const emailRef = useRef();
  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [showForgetPassword, setForgetPassword] = useState(true);
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSentOTP = () => {
    setConfirmPassword(true);
    setForgetPassword(false);
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: emailRef.current.value
    };

    try {
      const response = await fetch('http://localhost:5000/emailsend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setConfirmPassword(true);
        setForgetPassword(false);
        window.alert('Kindly Check your Email');
        console.log('OTP sent successfully');
      } 
      else {
        window.alert('Something went wrong');
        console.error(response.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleForgetPassword = () => {
    setConfirmPassword(false);
    setForgetPassword(true);
  }

  return (
    <div className='bg-purple-700 bg-opacity-40 rounded-xl flex flex-col justify-center align-center gap-2 text-center'>
      {showForgetPassword && (
        <>
          <div className='flex justify-end mt-2 mr-2'>
            <Link to="/">
              <button onClick={closePassword} className='rounded-full bg-white p-2 text-black'>
                <XCircle size={25} />
              </button>
            </Link>
          </div>
          <h2 className='text-3xl text-white ml-10 mr-10'>Forget Password</h2>
          <form onSubmit={handleSubmit}>
            <label className='text-2xl text-white'>Enter Your Email</label>
            <br />
            <input
              type='email'
              ref = {emailRef}
              id="email"
              value={email}
              autocomplete="off"
              onChange={handleEmailChange}
              placeholder='Enter Email Id'
              className='text-center text-black h-10 w-80 rounded-xl mr-10 ml-10 mt-8'
              required
            />
            <br/>
            
            <button type="submit" className='bg-white px-4 py-2 rounded-lg text-black mt-8 mb-10'>Send OTP</button>
  
          </form>
        </>
      )}
      {showConfirmPassword && <ConfirmPassword email={email} closeConfirmPassword={handleForgetPassword}/>}
    </div>
  );
}

export default ForgetPassword;