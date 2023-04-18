// import necessary components and libraries
import { Modal, Button } from "web3uikit";
import { useState, useEffect, useContext } from "react";
import { FaUser } from 'react-icons/fa';
import { Web3Context } from '../Web3Context.js';
import { contractAddress } from '../contract.js';
import axios from "axios";
import './styles/User.css';

// User component
function User() {
  // use the useState hook to define state variables
  const [isVisible, setVisible] = useState(false);
  const [tickets, setTickets] = useState([]);
  // use the useContext hook to access the Web3Context
  const { account } = useContext(Web3Context);
  // define a short version of the account address
  const shortAddress = account && `${account.slice(0, 6)}...${account.slice(-4)}`;

  // use the useEffect hook to fetch data when the component mounts or updates
  useEffect(() => {
    async function fetchData() {
      // fetch data from APIs using axios
      const responseE = await axios.get('http://localhost:4000/events/sql');
      const responseT = await axios.get('http://localhost:4000/api/tickets');
      const events = responseE.data;
      const tickets = responseT.data;
      // filter and map the tickets to create an array of customer tickets
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
      // update the tickets state variable
      setTickets(customerTickets);
    }
    fetchData();
  }, [account, isVisible]);

  // return a button and a Modal containing information about the user's tickets
  return (
    <>
      {/* Display a button with a user icon */}
      <button className="btn btn-outline-primary logins" onClick={() => setVisible(true)}>
        <FaUser />
      </button>
      {/* Display a Modal when the button is clicked */}
      <Modal
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={`Welcome ${shortAddress}!`}
        isVisible={isVisible}
      >
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", marginBottom: "15px" }}>
          {/* Display information about the user's tickets */}
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
                    <a className="linknft" href={ticket.tokenLink} target="_blank" rel="noreferrer"><Button theme="primary" text="View NFT" /></a>
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
// export the User component
export default User;