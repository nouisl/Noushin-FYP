// import hooks, styles and components
import { useState, useContext } from "react";
import { useNotification, Input, BannerStrip, Loading, Typography } from "web3uikit";
import { Web3Context } from '../Web3Context.js';
import { contractAddress } from '../contract.js';
import './styles/EventListing.css';

// EventListing component
function EventListing(props) {
    const { events } = props;
    const dispatch = useNotification();
    // define state for num_tickets and loading
    const [num_tickets, setNumTickets] = useState(1);
    const abi = require("../contractABI.json");
    const { web3, account } = useContext(Web3Context);
    const [loading, setLoading] = useState(false);

    // update the num_tickets value for a specific event
    const handleNumTicketsChange = (event_id, value) => {
        setNumTickets((prevNumTickets) => ({
            ...prevNumTickets,
            [event_id]: value,
        }));
    };

    // define handleSuccess function to dispatch success notification
    const handleSuccess = (event_name, num_tickets) => {
        dispatch({
            type: "success",
            message: `Nice! You have successfully booked ${num_tickets} ticket${num_tickets > 1 ? "s" : ""} for ${event_name}!`,
            title: "Booking Successful",
            position: "topL",
        });
    };

    // define handleError function to dispatch error notification
    const handleError = (msg) => {
        dispatch({
            type: "error",
            message: `${msg}`,
            title: "Booking Failed",
            position: "topL",
        });
    };

    // define handleNoAccount function to dispatch error notification for no account
    const handleNoAccount = () => {
        dispatch({
            type: "error",
            message: `You need to connect your wallet to book a rental`,
            title: "Not Connected",
            position: "topL",
        });
    };

    // define the bookTicket function
    const bookTicket = async function (event_id, event_name, event_price, num_tickets) {
        // create a contract instance using the ABI and contract address
        const contractAbi = abi;
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        // calculate the total price
        const totalPrice = event_price * num_tickets;

        try {
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 500000;
            // send the transaction to the contract
            setLoading(true);
            const result = await contract.methods.bookTickets(event_id, num_tickets)
                .send({ from: account, value: web3.utils.toWei(totalPrice.toString()), gasPrice: gasPrice, gasLimit: gasLimit });

            /// get the newTicketsBooked events from the result object
            let newTicketsBookedEvents = result.events.newTicketsBooked;

            // check if newTicketsBookedEvents is an array
            if (!Array.isArray(newTicketsBookedEvents)) {
                // if it's not an array, wrap it in an array
                newTicketsBookedEvents = [newTicketsBookedEvents];
            }

            // create an array to store the tokenIds
            const tokenIds = [];

            // initialize variables to store the sender and timestamp values
            let timestamp;

            // loop through the newTicketsBooked events and get the values emitted by each event
            for (const event of newTicketsBookedEvents) {
                const tokenId = event.returnValues.tokenId;
                timestamp = event.returnValues.timestamp;

                // add the tokenId to the tokenIds array
                tokenIds.push(tokenId);
            }

            // call API to insert data into database
            const response = await fetch('http://localhost:4000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tokenIds,
                    blockHash: result.blockHash,
                    timestamp,
                    sender: account,
                    eventId: event_id,
                    totalPrice: totalPrice
                })
            });

            // call API to update data in database
            const update = await fetch(`http://localhost:4000/api/events/${event_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ num_tickets }),
            });

            // call handleSuccess function to dispatch success notification
            handleSuccess(event_name, parseInt(num_tickets));
        } catch (error) {
            // call handleError function to dispatch error notification
            handleError(error.message);
        } finally {
            // set loading state to false
            setLoading(false);
        }
    };

    // return JSX for the EventListing component
    return (
        <>
            {/* if the loading state is true, display a banner strip with a loading spinner and text */}
            {loading && <BannerStrip
                height="50px"
                isCloseBtnVisible={false}
                position="sticky"
                text={<div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><Loading fontSize={12} size={12} spinnerType="loader" /><Typography color="#FFFFFF" variant="caption14">Purchase is being processed ...</Typography></div>}
                type="warning"
            />}
            {/* if there are events in the events array, map over the array and display information about each event */}
            {events.length > 0 ? (
                events.map((event, index) => (
                    <div key={event.event_id}>
                        <div className="eventDiv">
                            <img className="eventImg" src={event.img_url} alt="Event" />
                            <div className="eventInfo">
                                <div className="eventTitle" style={{ fontWeight: "bold" }}>{event.event_name}</div>
                                <p>{event.event_description}</p>
                                <p>
                                    <small className="text-muted">
                                        {new Date(event.event_date).toLocaleDateString()} at{" "}
                                        {event.start_time} - {event.end_time}
                                        <br />
                                        {event.venue} - {event.city}
                                    </small>
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Input
                                        label="Number of Tickets:"
                                        name="num_tickets"
                                        min={1}
                                        value={num_tickets[event.event_id]}
                                        onChange={(e) => handleNumTicketsChange(event.event_id, parseInt(e.target.value))}
                                        type="number"
                                        width="20px"

                                    />
                                </div>
                                <div className="bookButton">
                                    {num_tickets[event.event_id] + event.tickets_sold <= event.total_tickets && <button
                                        onClick={() => {
                                            if (account) {
                                                bookTicket(
                                                    event.event_id,
                                                    event.event_name,
                                                    event.price_per_ticket,
                                                    num_tickets[event.event_id]
                                                )
                                            } else {
                                                handleNoAccount()
                                            }
                                        }}
                                        text="Book Ticket"
                                        className="btn btn-danger"
                                    >   Book Ticket
                                    </button>}
                                    {num_tickets[event.event_id] + event.tickets_sold > event.total_tickets && <button className="btn btn-secondary disabled">Sold out</button>}
                                    <div className="price">
                                        {event.price_per_ticket} MATIC / Ticket
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="line" />
                    </div>
                )
                )) : (
                <p style={{ color: "black" }}>No event found.</p>
            )}
        </>
    );
}
// export the EventListing component
export default EventListing;
