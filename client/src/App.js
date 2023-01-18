import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Footer from "./pages/Footer";
import Access from "./pages/Access";

function App() {
  return (
      <div className="App">
          <Router>
              {/* <Header /> */}
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/acess" element={<Access />} />
                  <Route path="/db" element={<Dashboard />} />
              </Routes>
              <Footer />
          </Router>
      </div>
  );
}

export default App;

