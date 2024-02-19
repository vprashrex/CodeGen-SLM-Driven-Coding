import React from 'react';
import {Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import Logout from './components/Logout';
import ForgotPassword from './components/ForgotPassword';


const App = () => {
  return(
    <>
    <Navbar/>
    <Routes>
    <Route path ='/login' element={<Login/>}>
    </Route>
    <Route path ='/signup' element={<Signup/>}>
    </Route>
    <Route path = '/welcome' element={<Welcome/>}>
    </Route>
    <Route path = '/logout' element={<Logout/>}>
    </Route>
    <Route path ='/forgot-password' element={<ForgotPassword/>}>
    </Route>
    <Route path ='/' element={<Home/>}>
    </Route>
    </Routes>
    </>
  )
}

export default App