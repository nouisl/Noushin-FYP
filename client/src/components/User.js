import { Modal, Card } from "web3uikit";
import { useState, useEffect } from "react";
import { FaUser } from 'react-icons/fa';
import axios from "axios";

function User({ account }) {
  const [isVisible, setVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);

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
      <div onClick={() => setVisible(true)}>
        <FaUser className="fb mx-2" />
      </div>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title="Your Tickets"
        isVisible={isVisible}
      >
        <div style={{ display: "flex", justifyContent: "start", flexWrap: "wrap", gap: "10px" }}>
          {transactions.length > 0 ? (
            transactions.map((e, index) => (
              <div style={{ width: "200px" }}>
                <Card
                  isDisabled
                  title={e.attributes.artist}
                  description={e.attributes.size}
                >
                  <div>
                    <img
                      width="180px"
                      src={e.attributes.imgUrl}
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