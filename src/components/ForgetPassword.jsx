import React, { useState } from 'react';
import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import ConfirmPassword from './ConfirmPassword';

function ForgetPassword({ closePassword }) {

  const [showConfirmPassword, setConfirmPassword] = useState(false);
  const [showForgetPassword, setForgetPassword] = useState(true);
  const [email, setEmail] = useState('');

  const handleSentOTP = () => {
    setConfirmPassword(true);
    setForgetPassword(false);
  }

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
          <form>
            <label className='text-2xl text-white'>Enter Your Email</label>
            <br />
            <input
              type='email'
              placeholder='Enter Email Id'
              required
              className='text-center text-black h-10 w-80 rounded-xl mr-10 ml-10 mt-8'
            />
            <br/>
            
            <button onClick={handleSentOTP} type="submit" className='bg-white px-4 py-2 rounded-lg text-black mt-8 mb-10'>Sent OTP</button>
  
          </form>
        </>
      )}
      {showConfirmPassword && <ConfirmPassword closeConfirmPassword={handleForgetPassword}/>}
    </div>
  );
}

export default ForgetPassword;
