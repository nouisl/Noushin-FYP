import './App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./pages/Footer";

function App() {
  return (
      <div className="App">
          <Router>
              {/* <Header /> */}
              <Routes>
                  <Route path="/" element={<Home />} />

              </Routes>
              <Footer />
          </Router>
      </div>
  );
}

export default App;

