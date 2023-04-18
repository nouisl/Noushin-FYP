// import necessary components and libraries
import { Link } from "react-router-dom";
import "./styles/Header.css";
import logo from "../images/banner.png";
import { useNotification, Dropdown } from "web3uikit";
import { useContext } from "react";
import { Web3Context } from '../Web3Context.js';
import User from "./User.js";

// Header component
function Header() {
  // use the useNotification hook to display notifications
  const dispatch = useNotification();
  // use the useContext hook to access the Web3Context
  const { account, loadWeb3, handleLogout } = useContext(Web3Context);

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
        {/* <div className="dropdown">
          <button className="dropbtn"> Menu: </button>
          <div className="dropdown-content">
            <a>Home</a>
            <a>Events</a>
            <a>About Us</a>
            <a>FAQ</a>
            <a>Privacy Policy</a>
          </div>
        </div> */}
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
