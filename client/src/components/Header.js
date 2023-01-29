import { Link } from "react-router-dom";
import "./styles/Header.css";
import logo from "../images/logo5.png"
import { ConnectButton, Icon, Select, DatePicker, Input, Button } from "web3uikit";

function Header() {
  return (
    <>
      <div className="banner">
        <div>
          <Link to="/">
          <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="search">
          <div></div>
        </div>
        <div className="connect">
          <ConnectButton />
        </div>
      </div>
    </>
  );
};

export default Header;