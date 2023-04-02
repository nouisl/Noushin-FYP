import { Link } from "react-router-dom";
import "./styles/Header.css";
import logo from "../images/banner.png"
import { ConnectButton, Select, DatePicker, Input } from "web3uikit";
import { useState } from "react";
import { FaSearch } from 'react-icons/fa';

function Header() {
  return (
    <>
      <header className="banner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="connect">
          <ConnectButton />
        </div>
      </header>
      {/* <div className="hl"></div> */}
    </>

  );
};

export default Header;