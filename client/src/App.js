import './styles/App.css';
import Home from "./pages/Home";
import Event from "./pages/Event";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/Event";
import Privacy from "./components/Privacy";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from 'web3uikit';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
    return (
        <div className="App">
            <MoralisProvider >
            <NotificationProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/event" element={<Event />} />
                        <Route path="/aboutus" element={<AboutUs />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/privacy" element={<Privacy />} />
                    </Routes>
                </Router>
            </NotificationProvider>
            </MoralisProvider>
        </div>
    );
}

export default App;


