// import styles and components
import './styles/App.css';
import Home from "./pages/Home";
import Event from "./pages/Event";
import AboutUs from "./components/AboutUs";
import FAQ from "./components/FAQ";
import Privacy from "./components/Privacy";
import { NotificationProvider } from 'web3uikit';
import { Web3Provider } from './Web3Context.js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// App component
function App() {
    return (
        <div className="App">
                <NotificationProvider>
                    <Web3Provider>
                        <Router>
                            {/* Defining routes */}
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/event" element={<Event />} />
                                <Route path="/aboutus" element={<AboutUs />} />
                                <Route path="/faq" element={<FAQ />} />
                                <Route path="/privacy" element={<Privacy />} />
                            </Routes>
                        </Router>
                    </Web3Provider>
                </NotificationProvider>
        </div>
    );
}

// export the App component
export default App;


