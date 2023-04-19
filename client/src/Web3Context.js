import { createContext, useState } from 'react';
import { useNotification } from "web3uikit";
import Web3 from 'web3';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const { addNotification } = useNotification();

  async function getContractOwner(contractAddress, abi) {
    if (!web3) return;
    const contract = new web3.eth.Contract(abi, contractAddress);
    const owner = await contract.methods.owner().call();
    return owner;
  }

  async function loadWeb3() {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Instance);
      } catch (error) {
          addNotification({
              title: "Error",
              message: error.message,
              type: "danger",
              position: "topL",
          });
      }
    } else if (window.web3) {
      const web3Instance = new Web3(window.web3.currentProvider);
      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);
      setWeb3(web3Instance);
    } else {
      addNotification({
          title: "Error",
          message: "Non-Ethereum browser detected. You should consider trying MetaMask!",
          type: "danger",
          position: "topL",
        });
    }
  }

  function handleLogout() {
    setAccount(null);
    setWeb3(null);
  }

  return (
    <Web3Context.Provider value={{ account, web3, loadWeb3, handleLogout, getContractOwner }}>
      {children}
    </Web3Context.Provider>
  );
};