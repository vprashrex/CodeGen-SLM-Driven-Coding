import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/llm_logo.svg';
import { HashLink } from 'react-router-hash-link';
import {
  BrowserRouter as Router
} from "react-router-dom";
import { Link } from "react-router-dom";
import Form from "./Form";

export const NavBar = () => {

  const [activeLink, setActiveLink] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [])

  const onUpdateActiveLink = (value) => {
    setActiveLink(value);
  }

  return (
    <Router>
      <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" 
              style={{
                transform: `scale(${scrolled ? 0.8 : 1})`, // Adjust the scale based on the scroll position
                transition: "transform 0.3s ease", // Add a smooth transition effect
              }}
            />

          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Nav.Link>
              <Nav.Link href="#tech" className={activeLink === 'skills' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('skills')}>Tech</Nav.Link>
              <Nav.Link href="#projects" className={activeLink === 'projects' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('projects')}>More</Nav.Link>
            </Nav>

            <span className="navbar-text">
              <HashLink to='#connect'>
                <button className="vvd"><span>Sign up</span></button>
              </HashLink>
              <button onClick= {() => setShowModal(true)}className="vvd sign-in" style={{ height: "40px",padding: "6px 20px 20px 20px", border: "1.5px solid #ffff" }}><span>Sign in</span></button>
              {showModal && <Form onClose={() => setShowModal(false)}/>}
            </span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Router>
  )
}