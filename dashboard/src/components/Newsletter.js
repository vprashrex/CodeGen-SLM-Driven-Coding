import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";

export const Newsletter = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(1);  // Define opacity state
  const [delta, setDelta] = useState(150);
  const [index, setIndex] = useState(1);
  const toRotate = ["Print the Fibonacci series using the recursive method", "Convert Celsius to Fahrenheit."];
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text, opacity]);

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta((prevDelta) => prevDelta / 2);
    }

    if ((!isDeleting && updatedText === fullText) || (isDeleting && updatedText === '')) {
      setIsDeleting(!isDeleting);
      setLoopNum(isDeleting ? loopNum + 1 : loopNum);
      setIndex(isDeleting ? 1 : index - 1);
      setDelta(isDeleting ? 500 : period);

      // If typing is completed, start fading out the text
      if (!isDeleting) {
        setTimeout(() => {
          setOpacity(0);
        }, 500); // Adjust the duration as needed
      } else {
        setOpacity(1); // Reset opacity when starting a new text
      }
    } else {
      setIndex((prevIndex) => prevIndex + (isDeleting ? 0 : 1));
    }
  }
  
  return (
      <Col lg={12}>
        <div className="newsletter-bx wow slideInUp">
              <h3>Enter Prompt<br></br></h3>
              <h1 className="typing-text"><span className="txt-rotate" dataPeriod="2000" data-rotate='[ "Print the Fibonacci series using the recursive method", "Convert Celsius to Fahrenheit."]'><span className="wrap">{text}</span></span></h1>

              
        </div>
      </Col>
  )
}
