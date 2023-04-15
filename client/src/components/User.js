import { Modal, Card, Button } from "web3uikit";
import { useState, useEffect, useContext } from "react";
import { FaUser } from 'react-icons/fa';
import { Web3Context } from '../Web3Context.js';
import { contractAddress } from '../contract.js';
import axios from "axios";
import './styles/User.css';

function User() {
  const [isVisible, setVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  const { account } = useContext(Web3Context);
  const shortAddress = account && `${account.slice(0, 6)}...${account.slice(-4)}`;

  useEffect(() => {
    async function fetchData() {
      const responseE = await axios.get('http://localhost:4000/events/sql');
      const responseT = await axios.get('http://localhost:4000/api/tickets');
      const events = responseE.data;
      const tickets = responseT.data;
      const customerTickets = tickets.filter(ticket => ticket.customer_address === account).map(ticket => {
        const event = events.find(event => event.event_id === ticket.event_id);
        return {
          ticketId: ticket.token_id,
          eventName: event.event_name,
          eventImage: event.img_url,
          eventDate: event.event_date,
          eventTime: event.start_time,
          eventLocation: `${event.venue}, ${event.city}`,
          tokenLink: `https://mumbai.polygonscan.com/token/${contractAddress}?a=${ticket.token_id}#inventory`
        };
      });
      setTickets(customerTickets);
    }
    fetchData();
  }, [isVisible]);


  return (
    <>
      <button className="btn btn-outline-primary logins" onClick={() => setVisible(true)}>
        <FaUser />
      </button>

      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={`Welcome ${shortAddress}!`}
        isVisible={isVisible}
      >
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={ticket.eventImage}
                  alt={ticket.eventName} />
                <div className="card-body user-card">
                  <h5 className="card-title card-col">{ticket.eventName}</h5>
                  <p className="card-col">{new Date(ticket.eventDate).toLocaleDateString()} at{" "} {ticket.eventTime}
                    <br />{ticket.eventLocation}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: 'center' }}>
                    <a className="linknft" href={ticket.tokenLink} ><Button theme="primary" text="View NFT" /></a>
                  </div>
                </div>
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