// import styles and components
import './styles/Event.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect} from "react";
import axios from "axios";
import { useLocation } from "react-router";
import EventSearch from "../components/EventSearch";
import EventListing from "../components/EventListing";
import EventMap from "../components/EventMap";

// Event page component
function Event() {
  // define state for events and category
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  // get the location object from useLocation hook
  const location = useLocation();

  // use useEffect hook to update category state based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get('category') || '');
  }, [location.search]);

  // use useEffect hook to fetch events data based on category state
  useEffect(() => {
    async function fetchEvents(category) {
      const url = category ? `http://localhost:4000/events/sql?category=${category}` : 'http://localhost:4000/events/sql';
      const response = await axios.get(url);
      setEvents(response.data);
    }
    fetchEvents(category);
  }, [category]);

  // define handleSearch function to fetch events data based on search values
  const handleSearch = async (searchValue, dateValue, cityValue, catValue) => {
    let url = `http://localhost:4000/events/sql?name=${searchValue}&date=${dateValue}`;
    if (cityValue) {
      url += `&city=${cityValue}`;
    }
    if (catValue) {
      url += `&category=${catValue}`;
    }
    const response = await axios.get(url);
    setEvents(response.data);
  };

  // return a JSX element representing the Event page
  return (
    <>
    {/* Header component */}
      <Header />
      <div className="home-event-bg">
        <div className="event-search-card">
          <div className="card-body">
            <h5 className="card-title">Find an Event</h5>
            {/* Events search component */}
            <EventSearch onSearch={handleSearch} />
          </div>
        </div>
        <div className="card-body eventContent">
          <div className="eventContentL">
            {/* Events listing component */}
            <EventListing events={events} />
          </div>
          <div className="eventContentR">
            {/* Events map component */}
            <EventMap events={events} />
          </div>
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </>
  );
};

// export the Event page component
export default Event;