import { Col } from "react-bootstrap";
import Typewriter from "typewriter-effect";

export const Newsletter = () => {
  
  
  return (
      <Col lg={12}>
        <div className="newsletter-bx wow slideInUp">
              <h3>Enter Prompt<br></br></h3>

              <h1 className="typing-text">
                <Typewriter
                  options={{
                    strings: [
                      "Print the Fibonacci series using the recursive method",
                      "Convert Celsius to Fahrenheit."
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                  }}
                />
              </h1>
              
        </div>
      </Col>
  )
}
