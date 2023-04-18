// import React and other modules
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

// create a root for the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// call the reportWebVitals function
reportWebVitals();
