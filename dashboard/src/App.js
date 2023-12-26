import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Tech } from "./components/Tech";
import { Projects } from "./components/Projects";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function App() {


  return (
    <div className="App">
      <NavBar/>
      <Banner />
      <Tech />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
