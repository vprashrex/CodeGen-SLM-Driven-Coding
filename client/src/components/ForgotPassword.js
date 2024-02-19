import React, {useRef, useState} from 'react'
import ChangePswdForm from './ChangePswdForm';

const ForgotPassword = () => {
    const emailRef = useRef();
    const [email, setEmail] = useState('');
    const [otpForm, showForm] = useState(true);
  
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const data = {
        email: emailRef.current.value
      };
  
      try {
        const response = await fetch('/emailsend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
          window.alert('Kindly Check your Email');
          console.log('OTP sent successfully');
          showForm(false);
        } 
        else {
          window.alert('Something went wrong');
          console.error(response.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <div>
        <h2>Reset Password</h2>{ otpForm ?
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              ref = {emailRef}
              id="email"
              value={email}
              autocomplete="off"
              onChange={handleEmailChange}
              required
            />
          </div>
          <button type="submit">Send OTP</button>
        </form>
        : <ChangePswdForm email={emailRef.current.value}/>
        }       
        </div>
    );
  };
  
  export default ForgotPassword;