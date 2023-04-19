// import necessary components and libraries
import "./styles/Header.css";
import User from "./User.js";
import logo from "../images/banner.png";
import { Link } from "react-router-dom";
import { useNotification, Tag } from "web3uikit";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from '../Web3Context.js';
import { contractAddress } from '../contract.js';


// Header component
function Header() {
  // use the useNotification hook to display notifications
  const dispatch = useNotification();
  // use the useContext hook to access the Web3Context
  const { account, loadWeb3, handleLogout, getContractOwner } = useContext(Web3Context);
  const abi = require("../contractABI.json");
  const [owner, setOwner] = useState(null);

  // fetch the contract owner
  useEffect(() => {
    async function fetchOwner() {
      const owner = await getContractOwner(contractAddress, abi);
      setOwner(owner);
    }
    fetchOwner();
  }, []);

  // define a function to display a login notification
  const loginMsg = () => {
    dispatch({
      type: "success",
      message: "Welcome! You have been logged in successfully",
      title: "Login Successful",
      position: "topL",
    });
  };

  // define a function to display a logout notification
  const logoutMsg = () => {
    dispatch({
      type: "info",
      message: "You have been logged out successfully!",
      title: "Logout Successful",
      position: "topL",
    });
  };
  // return a header element containing a logo and login/logout buttons
  return (
    <>
      <header className="banner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="menu">
          <Link to="/" className="menu-item"><Tag color="blue" text="Home" /></Link>
          <Link to="/event" className="menu-item"><Tag color="blue" text="Events" /></Link>
          <Link to="/aboutus" className="menu-item"><Tag color="blue" text="About Us" /></Link>
          <Link to="/faq" className="menu-item"><Tag color="blue" text="FAQ" /></Link>
          {account === owner &&
            <Link to="/create" className="menu-item"><Tag color="blue" text="List Event" /></Link>}
        </div>
        <div className="connect">
          {/* If the user is logged in, display the User component */}
          {account && <User />}
          {/* If the user is not logged in, display a button to connect wallet */}
          {!account &&
            <button className="btn btn-primary login" onClick={() => { loadWeb3(); loginMsg(); }}>Connect Wallet</button>
          }
          {/* If the user is logged in, display a button to logout */}
          {account &&
            <button className="btn btn-danger logout" onClick={() => { handleLogout(); logoutMsg(); }}>Logout</button>
          }
        </div>
      </header>
    </>
  );
};
// export the Header component
export default Header;
