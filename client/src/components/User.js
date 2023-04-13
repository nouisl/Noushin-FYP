import { Modal, Card } from "web3uikit";
import { useState, useEffect, useContext} from "react";
import { FaUser } from 'react-icons/fa';
import { Web3Context } from '../Web3Context.js';
import axios from "axios";

function User() {
  const [isVisible, setVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { account } = useContext(Web3Context);

  const shortAddress = account && `${account.slice(0, 6)}...${account.slice(-4)}`;

  useEffect(() => {
    async function fetchTransactions() {
      const url = `http://localhost:4000/transactions`;
      const response = await axios.get(url);
      setTransactions(response.data);
    }
    fetchTransactions();
  }, [isVisible]);


  return (
    <>
      <button className="btn btn-outline-primary logins" onClick={() => setVisible(true)}>
        <FaUser/>
      </button>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={`Welcome ${shortAddress}!`}
        isVisible={isVisible}
      >
        <div style={{ display: "flex", justifyContent: "start", flexWrap: "wrap", gap: "10px" }}>
          {transactions.length > 0 ? (
            transactions.map((e, index) => (
              <div style={{ width: "200px" }}>
                <Card
                  isDisabled
                  title={e.event_name}
                  description={e.event_date}
                >
                  <div>
                    <img
                      width="180px"
                      src={e.img_url}
                    />
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <p style={{ color: "black" }}>No purchases found.</p>
          )}
        </div>
      </Modal>
    </>
  );
}

export default User;