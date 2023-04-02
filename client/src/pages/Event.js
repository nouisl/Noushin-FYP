import './styles/Event.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import User from "../components/User";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { ConnectButton, Button, useNotification, color } from "web3uikit";
import Categories from "../components/Categories";
import EventSearch from "../components/EventSearch";
import EventMap from "../components/EventMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { FaSearch } from 'react-icons/fa';

function Event() {
  const [events, setEvents] = useState([]);
  const dispatch = useNotification();

  const handleSuccess = () => {
    dispatch({
      type: "success",
      message: `Nice! You are going to!!`,
      title: "Booking Succesful",
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

  const [category, setCategory] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get('category') || '');
  }, [location.search]);

  useEffect(() => {
    async function fetchEvents(category) {
      const url = category ? `http://localhost:3000/events/sql?category=${category}` : 'http://localhost:3000/events/sql';
      const response = await axios.get(url);
      setEvents(response.data);
    }

    fetchEvents(category);
  }, [category]);

  const handleSearch = async (searchValue, dateValue, cityValue) => {
    let url = `http://localhost:3000/events/sql?name=${searchValue}&date=${dateValue}`;
    if (cityValue) {
      url += `&city=${cityValue}`;
    }
    const response = await axios.get(url);
    setEvents(response.data);
  };

  return (
    <>
      <Header />
      <div className="categories">
        <Categories />
      </div>
      <div className="home-event">
        <div className="event-search-card">
          <div className="card-body">
            <h5 className="card-title">Find an Event</h5>
            <EventSearch onSearch={handleSearch} />
          </div>
        </div>
        <div className="container">
          <div className="row">
            {events.length > 0 ? (
              events.map((event, index) => (
                <div key={event.event_id} className={`col-sm-${12 / events.length} ${index > 2 ? 'offset-sm-3' : ''} mb-3`}>
                  <div className="card">
                    <img className="card-img-top" src={event.img_url} alt="Event Image" />
                    <div className="card-body">
                      <h5 className="card-title" style={{ color: "black" }}>{event.event_name}</h5>
                      <p className="card-text">{event.event_description}</p>
                      <p className="card-text"><small className="text-muted">{new Date(event.event_date).toLocaleDateString()} at {event.start_time} - {event.end_time}</small></p>
                      <p className="card-text">Price per ticket: {event.price_per_ticket} MATIC</p>
                      <Link to={`/event/${event.event_id}`} className="btn btn-danger">Book Ticket</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "white" }}>No event found.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Event;