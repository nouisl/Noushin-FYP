import { Link } from "react-router-dom";
import "./styles/Header.css";
import logo from "../images/banner.png";
import { ConnectButton, useNotification } from "web3uikit";
import { useEffect, useState } from "react";
import User from "./User.js";
import Web3 from "web3";

function Header() {
  const [loadButton, setLoadButton] = useState(false);
  const [account, setAccount] = useState(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    setLoadButton(true);
    async function loadWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          addNotification({
            title: "Error",
            message: error.message,
            type: "danger",
            position: "topL",
          });
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      } else {
        addNotification({
          title: "Error",
          message: "Non-Ethereum browser detected. You should consider trying MetaMask!",
          type: "danger",
          position: "topL",
        });
      }
    }
    loadWeb3();
  }, [addNotification]);

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
            <User account={account} />
          }
          <ConnectButton moralisAuth={false} />
        </div>
      </header>
    </>
  );
};

export default Header;
