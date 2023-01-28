import './styles/Home.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ConnectButton, Icon, Select, DatePicker, Input, Button } from "web3uikit";
//import bg from "../images/image.png"

function Home() {
  return (
    <>
      <div className="banner">
        <div>
          <Link to="/">
          <img className="logo"  src="https://www.carnival.com/-/media/images/header2013/carnival-logo-png.png" alt="logo"></img>
          </Link>
        </div>
        <div className="search">
          <div></div>
        </div>
        <div className="connect">
          <ConnectButton />
        </div>
      </div>
      <div className="column">
        <p></p>
        <h1>THIS IS HOME</h1>
        <div className="container">
          <div className="row align-items-center">
            <div className="d-flex">
              <p className="mx-auto">
                <Link to="/db"><button>START SHOPPING NOW</button></Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;