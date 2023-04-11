import { useEffect, useState } from "react";
import { useNotification, Input } from "web3uikit";
import './styles/EventListing.css';
import axios from "axios";
import Web3 from "web3";

function EventListing(props) {
    const { events } = props;
    const dispatch = useNotification();
    const [num_tickets, setNumTickets] = useState(1);
    const abi = require("../contractABI.json");
    const [account, setAccount] = useState(null);
    const { addNotification } = useNotification();

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

    useEffect(() => {
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

    const bookTicket = async function (event_id, event_name, event_price, num_tickets) {
        // check if web3 is available
        if (!window.ethereum) {
            handleError("Please install a web3 provider like Metamask to book a ticket.");
            return;
        }
        const web3 = new Web3(window.ethereum);
        const contractAddress = "0x2d2Fdb2aF9723FDFEc66354c5cF9E3Ff025FA114";
        const contractAbi = abi;
        const contract = new web3.eth.Contract(contractAbi, contractAddress);
        const totalPrice = event_price * num_tickets;

        try {
            // check if user is connected to a wallet
            if (!window.ethereum.selectedAddress) {
                handleNoAccount();
                return;
            }
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 500000;

            // send the transaction to the contract
            await contract.methods.bookTickets(event_id, num_tickets)
                .send({ from: window.ethereum.selectedAddress, value: web3.utils.toWei(totalPrice.toString()), gasPrice: gasPrice, gasLimit: gasLimit });

            handleSuccess(event_name, parseInt(num_tickets));
        } catch (error) {
            handleError(error.message);
        }
    };

    return (
        <>
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
