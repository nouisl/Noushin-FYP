// import necessary components and libraries
import './styles/CreateEvent.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect, useContext } from "react";
import { contractAddress } from '../contract.js';
import { Web3Context } from '../Web3Context.js';
import { useNotification, BannerStrip, Typography, Loading } from "web3uikit";
import axios from "axios";

function CreateEvent() {
    const dispatch = useNotification();
    const { web3, account, getContractOwner } = useContext(Web3Context);
    const abi = require("../contractABI.json");
    const categories = ["Travel", "Sport", "Festival", "Concert"];
    const [loading, setLoading] = useState(false);
    const [owner, setOwner] = useState(null);
    const [event_name, setEventName] = useState("");
    const [city, setCity] = useState("");
    const [venue, setVenue] = useState("");
    const [img_url, setImgUrl] = useState("");
    const [event_description, setEventDescription] = useState("");
    const [event_date, setEventDate] = useState("");
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    const [total_tickets, setTotalTickets] = useState(0);
    const [price_per_ticket, setPricePerTicket] = useState(0);
    const [organizer, setOrganizer] = useState("");
    const [tickets_sold, setTicketsSold] = useState(0);
    const [category, setCategory] = useState("");

    // get owner of contract
    useEffect(() => {
        async function fetchOwner() {
            const owner = await getContractOwner(contractAddress, abi);
            setOwner(owner);
        }
        fetchOwner();
    }, []);

    // define handleSuccess function to dispatch success notification
    const handleSuccess = (event_id, event_name) => {
        dispatch({
            type: "success",
            message: `Nice! You have successfully created an event listing for ${event_name} with ID ${event_id}!`,
            title: "Listing Successful",
            position: "topL",
        });
    };

    // define handleError function to dispatch error notification
    const handleError = (msg) => {
        dispatch({
            type: "error",
            message: `${msg}`,
            title: "Listing Failed",
            position: "topL",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // send MySQL data to backend
            const response = await axios.post('http://localhost:4000/events/create', {
                event_name,
                city,
                venue,
                img_url,
                event_description,
                event_date,
                start_time,
                end_time,
                total_tickets,
                price_per_ticket,
                organizer,
                tickets_sold,
                category
            });
            const event_id = response.data.eventId;
            const contract = new web3.eth.Contract(abi, contractAddress);
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 500000;
            setLoading(true);
            const tickets = total_tickets - tickets_sold;
            const result = await contract.methods.createEvent(event_id, event_name, tickets, price_per_ticket)
                .send({ from: account, gasPrice: gasPrice, gasLimit: gasLimit });
            handleSuccess(event_id, event_name);
        } catch (error) {
            // call handleError function to dispatch error notification
            handleError(error.message);
        } finally {
            // set loading state to false
            setLoading(false);
            // reset the state of each input field
            setEventName("");
            setCity("");
            setVenue("");
            setImgUrl("");
            setEventDescription("");
            setEventDate("");
            setStartTime("");
            setEndTime("");
            setTotalTickets(0);
            setPricePerTicket(0);
            setOrganizer("");
            setTicketsSold(0);
            setCategory("");
        }
    };

    if (account !== owner) {
        return (
            <>
                {/* Header component */}
                <Header />
                <div className="home-event-bg">
                    <div className="event-search-card">
                        <div className="card-body">
                            <h3 className="card-title" style={{ margin: "10px" }}>You are not authorized to access this page.</h3>
                        </div>
                    </div>
                </div>
                {/* Footer component */}
                <Footer />
            </>
        );
    }

    return (
        <>
            {/* if the loading state is true, display a banner strip with a loading spinner and text */}
            {loading && <BannerStrip
                height="50px"
                isCloseBtnVisible={false}
                position="sticky"
                text={<div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}><Loading fontSize={12} size={12} spinnerType="loader" /><Typography color="#FFFFFF" variant="caption14">Listing is being created ...</Typography></div>}
                type="warning"
            />}
            {/* Header component */}
            <Header />
            <div className="home-event-bg">
                <div className="event-search-card">
                    <div className="card-body labelling">
                        <h3 className="card-title create-title">List an event:</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Event Name:
                                <input placeholder="enter name" type="text" value={event_name} onChange={(e) => setEventName(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                City:
                                <input placeholder="enter city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Venue:
                                <input placeholder="enter venue" type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Image URL:
                                <input placeholder="enter image url" type="text" value={img_url} onChange={(e) => setImgUrl(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Event Description:
                                <input placeholder="enter description" type="text" value={event_description} onChange={(e) => setEventDescription(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Event Date:
                                <input type="date" value={event_date} onChange={(e) => setEventDate(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Start Time:
                                <input type="time" value={start_time} onChange={(e) => setStartTime(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                End Time:
                                <input type="time" value={end_time} onChange={(e) => setEndTime(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Total Tickets:
                                <input type="number" placeholder="enter total tickets" value={total_tickets} onChange={(e) => setTotalTickets(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Price per Ticket:
                                <input type="number" placeholder="enter price per ticket" value={price_per_ticket} onChange={(e) => setPricePerTicket(e.target.value)} />
                            </label> 
                            <br />
                            <label>
                                Tickets sold:
                                <input type="number"placeholder="enter amount of sold tickets" value={tickets_sold} onChange={(e) => setTicketsSold(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Organizer:
                                <input placeholder="enter organizer's name" type="text" value={organizer} onChange={(e) => setOrganizer(e.target.value)} />
                            </label>
                            <br />
                            <label>
                                Category:
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="" disabled selected className='muted'>
                                        choose a category
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>

                            </label>
                            <br />
                            <input className='btn btn-primary btn-lg submit' type="submit" value="Submit" />
                        </form>
                    </div>
                </div>
            </div>
            {/* Footer component */}
            <Footer />
        </>
    );
};

export default CreateEvent;
