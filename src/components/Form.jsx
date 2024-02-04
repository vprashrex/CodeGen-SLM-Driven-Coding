import React from 'react';
import { XCircle, UserRound, LockKeyhole } from 'lucide-react';

function Form({ onClose }) {
  return (
    <div className='fixed inset-0 backdrop-filter backdrop-blur-sm flex justify-center items-center'>

      <div className='flex flex-col text-white'>
        <button onClick={onClose} className='place-self-end bg-black'>
          <XCircle />
        </button>

        {/* Form */}
        <div className='bg-purple-700 px-5 bg-grey d-flex flex-column gap-3 
        align-items-center justify-content-center rounded-lg mt-2'>

          <form className='flex flex-col justify-center items-center gap-5 text-black'>
            <label className='text-3xl font-extrabold pt-3'>Sign In</label>

            <div className='flex flex-row'>
              <UserRound size={35} className='mr-2 mt-1' />
              <input
                type='text'
                placeholder='Enter Username'
                required
                className='text-center h-12 w-80 rounded-xl'
              />
            </div>

            <div className='flex flex-row'>
              <LockKeyhole size={35} className='mr-2 mt-1' />
              <input
                type='password'
                placeholder='Enter Password'
                required
                className='text-center h-12 w-80 rounded-xl'
              />
            </div>

            <p>
              Forget Password?
              <span className='text-yellow-500 cursor-pointer'> Click Here
              </span>
            </p>

            <button className='bg-violet-700 px-4 rounded-lg text-lg mb-10 text-black border-none'>Register</button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
