import { useState, useContext } from "react";
import { useNotification, Input, BannerStrip, Loading, Typography } from "web3uikit";
import { Web3Context } from '../Web3Context.js';
import './styles/EventListing.css';


function EventListing(props) {
    const { events } = props;
    const dispatch = useNotification();
    const [num_tickets, setNumTickets] = useState(1);
    const abi = require("../contractABI.json");
    const { web3, account } = useContext(Web3Context);
    const [loading, setLoading] = useState(false);

    const handleSuccess = (event_name, num_tickets) => {
        dispatch({
            type: "success",
            message: `Nice! You have successfully booked ${num_tickets} ticket${num_tickets > 1 ? "s" : ""} for ${event_name}!`,
            title: "Booking Successful",
            position: "topL",
        });
    };

    const handleError = (msg) => {
        dispatch({
            type: "error",
            message: `${msg}`,
            title: "Booking Failed",
            position: "topL",
        });
    };

    const handleNoAccount = () => {
        dispatch({
            type: "error",
            message: `You need to connect your wallet to book a rental`,
            title: "Not Connected",
            position: "topL",
        });
    };

    const bookTicket = async function (event_id, event_name, event_price, num_tickets) {
        const contractAddress = "0x2d2Fdb2aF9723FDFEc66354c5cF9E3Ff025FA114";
        const contractAbi = abi;
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        const totalPrice = event_price * num_tickets;

        try {
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 500000;
            // send the transaction to the contract
            setLoading(true);
            const result = await contract.methods.bookTickets(event_id, num_tickets)
                .send({ from: account, value: web3.utils.toWei(totalPrice.toString()), gasPrice: gasPrice, gasLimit: gasLimit });
                
            // Get returned values from result
            const blockHash = result.events[0].returnValues[0];
            const timestamp = result.events[0].returnValues[1];
            const sender = result.events[0].returnValues[2];
            const returnedEventId = result.events[0].returnValues[3];
            const returnedTotalPrice = result.events[0].returnValues[4];
            const tokenIds = result.events[0].returnValues[5];

            // Call API to insert data into database
            const response = await fetch('http://localhost:4000/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tokenIds,
                    blockHash,
                    timestamp,
                    sender,
                    eventId: returnedEventId,
                    totalPrice: returnedTotalPrice
                })
            });
            handleSuccess(event_name, parseInt(num_tickets));
        } catch (error) {
            handleError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && <BannerStrip
                height="50px"
                isCloseBtnVisible={false}
                position="sticky"
                text={<div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><Loading fontSize={12} size={12} spinnerType="loader" /><Typography color="#FFFFFF" variant="caption14">Purchase is being processed ...</Typography></div>}
                type="warning"
            />}
            {events.length > 0 ? (
                events.map((event, index) => (
                    <div key={event.event_id}>
                        <div className="eventDiv">
                            <img className="eventImg" src={event.img_url} alt="Event Image" />
                            <div className="eventInfo">
                                <div className="eventTitle">{event.event_name}</div>
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
                                        min="1"
                                        value={num_tickets}
                                        onChange={(e) => setNumTickets(parseInt(e.target.value))}
                                        type="number"
                                        width="20px"

                                    />
                                </div>
                                <div className="bookButton">
                                    <button
                                        onClick={() => {
                                            if (account) {
                                                bookTicket(
                                                    event.event_id,
                                                    event.event_name,
                                                    event.price_per_ticket,
                                                    num_tickets
                                                )
                                            } else {
                                                handleNoAccount()
                                            }
                                        }}
                                        /* to={`/event/${event.event_id}`} */
                                        text="Book Ticket"
                                        className="btn btn-danger"
                                    >   Book Ticket
                                    </button>
                                    <div className="price">
                                        {/* <Icon fill="#808080" size={10} svg="matic" />{" "} */}
                                        {event.price_per_ticket} MATIC / Ticket
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="line" />
                    </div>
                ))
            ) : (
                <p style={{ color: "white" }}>No event found.</p>
            )}
        </>
    );
}

export default EventListing;
