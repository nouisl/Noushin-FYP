import { Modal, Card } from "web3uikit";
import { useState, useEffect, useContext} from "react";
import { FaUser } from 'react-icons/fa';
import { Web3Context } from '../Web3Context.js';
import axios from "axios";

function User() {
  const [isVisible, setVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);
  const { account } = useContext(Web3Context);

  const shortAddress = account && `${account.slice(0, 6)}...${account.slice(-4)}`;

  useEffect(() => {
    async function fetchEvents() {
      const url = 'http://localhost:4000/events/sql';
      const response = await axios.get(url);
      setEvents(response.data);
    }
    fetchEvents(category);

    async function fetchTickets() {
      const url = `http://localhost:4000/api/tickets`;
      const response = await axios.get(url);
      setTickets(response.data);
    }
    fetchTickets();
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
          {tickets.length > 0 ? (
            tickets.map((e, index) => (
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