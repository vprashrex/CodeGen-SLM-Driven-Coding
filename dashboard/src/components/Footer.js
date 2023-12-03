import { Container, Row, Col } from "react-bootstrap";
import { MailchimpForm } from "./MailchimpForm";
import logo from "../assets/img/llm_logo.svg";
<<<<<<< HEAD
=======

>>>>>>> f309df7cd447a7a022f8f1c8f070ecf101e0230b

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          <MailchimpForm />
          <Col size={12} sm={6}>
            <img src={logo} alt="Logo" />
          </Col>
<<<<<<< HEAD
=======
          <Col size={12} sm={6} className="text-center text-sm-end">
            
          </Col>
>>>>>>> f309df7cd447a7a022f8f1c8f070ecf101e0230b
        </Row>
      </Container>
    </footer>
  )
}
