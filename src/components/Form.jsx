import React, { useState,useEffect } from 'react';
import { XCircle, UserRound, LockKeyhole } from 'lucide-react';
import { Link, useNavigate} from 'react-router-dom';
//import {jwtDecode} from 'jwt-decode';

import ForgetPassword from './ForgetPassword';

function Form({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const SendData = async (data) =>{
    try {
      const response = await fetch('http://localhost:5000/signin', {
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

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleForgetPasswordClick = () => {
    setShowPassword(true);
    setFormVisible(false);
  };

  const handleFormVisible = () => {
    setFormVisible(true);
    setShowPassword(false);
  };

  return (
    <div className='fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center'>
      {formVisible && (
        <div className='mt-5 flex flex-col gap-3 text-white'>

          <div className='flex justify-end'>
          <Link to="/.">
          <button onClick={onClose} className='rounded-full bg-white p-2 text-black'>
            <XCircle size={25} />
          </button>
          </Link>
          </div>

          <div className='bg-purple-600 bg-opacity-40 rounded-xl px-5 py-5 flex flex-col gap-8 items-center' style={{maxHeight: '400px'}}>
            <form className='flex flex-col justify-center items-center gap-3' onSubmit={handleSubmit}>
              <label className='text-3xl font-extrabold'>Sign In</label>

              <div className='flex flex-row'>
                <UserRound size={25} className='mr-2 mt-1' />
                <input
                  type='email'
                  id = "email"
                  value = {email}
                  placeholder='Enter email'
                  required
                  className='text-center text-black h-10 w-80 rounded-xl'
                  onChange={handleEmailChange}
                />
              </div>

              <div className='flex flex-row'>
                <LockKeyhole size={25} className='mr-2 mt-1' />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className='text-center text-black h-10 w-80 rounded-xl'
                />
              </div>

              <p>
                Forget Password?
                  <Link to="/forget-password">
                    <span onClick={handleForgetPasswordClick} className='text-yellow-500 cursor-pointer underline-none'>
                    Click Here
                    </span>
                  </Link>
                  
              </p>

              <button className='bg-white px-4 py-2 rounded-lg text-black'>Sign In</button>
            </form>
          </div>
        </div>
      )}

      {showPassword && <ForgetPassword closePassword={handleFormVisible} />}
    </div>
  );
}

export default Form;
