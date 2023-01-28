import './styles/App.css';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from 'web3uikit';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";


function App() {
    return (
        <div className="App">
            <MoralisProvider appId="xxx" serverUrl="xxx">
                <NotificationProvider>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/db" element={<Dashboard />} />
                            <Route path="/cart" element={<Cart />} />
                        </Routes>
                    </Router>
                </NotificationProvider>
            </MoralisProvider>
        </div>
    );
}

export default App;


