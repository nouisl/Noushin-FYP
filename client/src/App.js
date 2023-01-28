import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/db" element={<Dashboard />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;


