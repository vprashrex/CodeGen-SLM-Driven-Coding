import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
  const emailRef = useRef();
  const passRef = useRef();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const pass = passRef.current.value;
    
  }


  return (
    <>
      
      <div
        className="mt-3 w-100 d-flex flex-column gap-4 align-items-center justify-content-center container"
        style={{
          height: "70vh",
        }}
      >
        <div className="d-flex flex-column align-items-center gap-3 justify-content-center ">
          <h1>Welcome Back</h1>
          <button className="btn btn-dark d-flex gap-2 align-items-center w-100 justify-content-center">
            <i className="bi bi-google" />
            Continue with Google
          </button>
        </div>
        <div className="separator">
          <span>or</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column gap-3 form-signup"
        >
          <input
            required
            type="email"
            className="form-control"
            placeholder="Email"
            ref={emailRef}
          />
          <input
            required
            type="password"
            className="form-control"
            placeholder="Password"
            ref={passRef}
          />
          <button
            type="submit"
            className="btn btn-dark fw-bold py-2"
          >
          </button>
        </form>
        <Link className="text-center" to="/forget-password">
          Forget Password?
        </Link>
      </div>
    </>
  );
}
