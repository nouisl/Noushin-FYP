import './styles/Event.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect} from "react";
import axios from "axios";
import { useLocation } from "react-router";
import Categories from "../components/Categories";
import EventSearch from "../components/EventSearch";
import EventListing from "../components/EventListing";
import EventMap from "../components/EventMap";

function Event() {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get('category') || '');
  }, [location.search]);

  useEffect(() => {
    async function fetchEvents(category) {
      const url = category ? `http://localhost:4000/events/sql?category=${category}` : 'http://localhost:4000/events/sql';
      const response = await axios.get(url);
      setEvents(response.data);
    }
    fetchEvents(category);
  }, [category]);

  const handleSearch = async (searchValue, dateValue, cityValue) => {
    let url = `http://localhost:4000/events/sql?name=${searchValue}&date=${dateValue}`;
    if (cityValue) {
      url += `&city=${cityValue}`;
    }
    const response = await axios.get(url);
    setEvents(response.data);
  };

  return (
    <>
      <Header />
      {/* <div className="categories">
        <Categories />
      </div> */}
      <div className="home-event-bg">
        <div className="event-search-card">
          <div className="card-body">
            <h5 className="card-title">Find an Event</h5>
            <EventSearch onSearch={handleSearch} />
          </div>
        </div>
        <div className="card-body eventContent">
          <div className="eventContentL">
            <EventListing events={events} />
          </div>
          <div className="eventContentR">
            <EventMap events={events} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Event;