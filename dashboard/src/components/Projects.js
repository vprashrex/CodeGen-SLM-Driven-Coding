import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import colorSharp2 from "../assets/img/color-sharp2.png";
import codegen from "../assets/img/codegen.svg";
import anatomy from "../assets/img/anatomy.svg";
import arrow1 from "../assets/img/arrow1.svg";
import arrow2 from "../assets/img/arrow2.svg";
import React, { useState } from 'react';



import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const [currentItem, setCurrentItem] = useState('item1');

  const handleArrowClick = (direction) => {
    if (direction === 'prev') {
      setCurrentItem('item1');
    } else if (direction === 'next') {
      setCurrentItem('item2');
    }
  };
  return (
    <section className="project" id="projects">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>LLM DRIVEN CODING</h2>
                <p> Large Language Model (LLM) driven coding, which involves using a language model to generate and complete code based on user instructions. This can be a powerful approach for automating certain aspects of coding.</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="first">CodeGen</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="second">CodeAutoComplete</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="third">Tab 3</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <section className="codegen" id="codegen">
                          <div className="container">
                            <div className="row">
                              <div className="col-12">
                                {/* <img style={{width:"32px",height:"32px",position:"relative",top:"40%",left:"-4%",cursor:"pointer"}} src={arrow1} alt="arrow1" onClick={() => handleArrowClick("prev")}/>
                                  <div className="codegen-bx wow zoomIn">
                                    <div className="codegen-item item1">
                                      <h2 className="codegen-sign">
                                        <img  className="codegen-img-sign" src={codegen} alt="Codegen"></img>
                                      </h2>
                                      <p style={{fontSize:"20px"}}>
                                        The Code Instruction Model is designed to comprehend and interpret natural language instructions. It understands the user's intent, identifies relevant programming tasks, and translates them into a structured format that can be easily processed by the Code Generation Model. This model serves as the bridge between human-readable instructions and code-related concepts.
                                      </p>
                                    </div>
                                  </div>
                              
                                <img style={{width:"32px",height:"32px",position:"relative",top:"-52%",right:"-101%",cursor:"pointer"}} src={arrow2} alt="arrow2" onClick={() => handleArrowClick('next')}/> */}
                                <div>
                                  <img
                                    style={{ width: "32px", height: "32px", position: "absolute", top: "63%", left: "6%", cursor: "pointer" }}
                                    src={arrow1}
                                    alt="arrow1"
                                    onClick={() => handleArrowClick("prev")}
                                  />
                                  <div className={`codegen-item ${currentItem === 'item1' ? 'item1' : 'item2'}`} style={{ display: currentItem === 'item1' ? 'flex': 'none'}}>

                                    <div className="codegen-bx wow zoomIn">
                                      {currentItem === 'item1' && (
                                        <>
                                          <h2 className="codegen-sign">
                                            <img className="codegen-img-sign" src={codegen} alt="Codegen"></img>
                                          </h2>
                                          <p style={{ fontSize: "20px" }}>
                                            The Code Instruction Model is designed to comprehend and interpret natural language instructions. It understands the user's intent, identifies relevant programming tasks, and translates them into a structured format that can be easily processed by the Code Generation Model. This model serves as the bridge between human-readable instructions and code-related concepts.
                                          </p>
                                        </>
                                      )}
                                      
                                    </div>
                                    
                                    
                                  </div>
                                  <div className={`codegen-item ${currentItem === 'item2' ? 'item2' : 'item1'}`} style={{ display: currentItem === 'item2' ? 'flex' : 'none' ,marginTop:"-60px",marginBlockEnd:"-60px"}}>
                                    {currentItem === 'item2' && (
                                      <img className="anatomy" src={anatomy} alt="anatomy" ></img>
                                    )}
                                  </div>
                                  
                                  <img
                                    style={{ width: "32px", height: "32px", position: "absolute", top: "63%", right: "6%", cursor: "pointer" }}
                                    src={arrow2}
                                    alt="arrow2"
                                    onClick={() => handleArrowClick('next')}
                                  />
                                </div>
                              </div>

                            </div>
                          </div>
                      </section>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2} alt="backg-img"></img>
    </section>
  )
}
