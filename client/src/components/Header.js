import { Link } from "react-router-dom";
import "./styles/Header.css";
import logo from "../images/banner.png";
import { useNotification } from "web3uikit";
import { useContext } from "react";
import { Web3Context } from '../Web3Context.js';
import User from "./User.js";

function Header() {
  const dispatch = useNotification();
  const { account, loadWeb3, handleLogout } = useContext(Web3Context);

  const loginMsg = (acc) => {
    dispatch({
      type: "success",
      message: "Welcome! You have been logged in successfully",
      title: "Login Successful",
      position: "topL",
    });
  };

  const logoutMsg = () => {
    dispatch({
      type: "info",
      message: "You have been logged out successfully!",
      title: "Logout Successful",
      position: "topL",
    });
  };

  return (
    <>
      <header className="banner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>
        <div className="connect">
          {account &&
            <User />
          }
          {!account &&
            <button className="btn btn-primary login" onClick={() => { loadWeb3(); loginMsg(); }}>Connect Wallet</button>
          }
          {/* {account &&
              <button className="btn btn-outline-primary login logins">{account}</button>
          }  */}
          {account &&
            <button className="btn btn-danger logout" onClick={() => { handleLogout(); logoutMsg(); }}>Logout</button>
          }
        </div>
      </header>
    </>
  );
};

export default Header;
