import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.svg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import { ArrowRightCircle } from 'react-bootstrap-icons';
import Typewriter from "typewriter-effect";

export const Banner = () => {
  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <span className="tagline" style={{marginLeft:'20px'}}>SLM Driven Coding</span>
                <h1>
                  <span>
                    <span className="wrap">
                      <Typewriter
                        options={{
                          strings: [
                          "CodeGen",
                          "Code AutoComplete"
                          ],
                          autoStart: true,
                          loop: true,
                          deleteSpeed: 50,
                        }}/>
                      </span>
                  </span>
                </h1>
                
                <span className="code-gen">
                  <button onClick={() => window.location.href="http://127.0.0.1:8000/codegen"} className="vvd"><span>CodeGen <ArrowRightCircle size={25} /></span></button>
                  <button style={{marginLeft:'80px'}} onClick={() => window.location.href="http://127.0.0.1:8000/autocomplete"} className="vvd"><span>Code AutoComplete <ArrowRightCircle size={25} /></span></button>

                </span>
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={headerImg} alt="Header Img"/>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}