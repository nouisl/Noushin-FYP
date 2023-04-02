import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch } from 'react-icons/fa';

function EventSearch(props) {
    const [searchValue, setSearchValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [cityValue, setCityValue] = useState("");
    const [cities, setCities] = useState([]);
  
    useEffect(() => {
      async function fetchCities() {
        const response = await axios.get('http://localhost:3000/events/cities');
        setCities(response.data);
      }
  
      fetchCities();
    }, []);
  
    return (
      <div className="event-search">
        <input
          type="text"
          placeholder="Search by name"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <input
          type="date"
          placeholder="Filter by date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
        />
        <select
          value={cityValue}
          onChange={(e) => setCityValue(e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <button className="btn btn-danger" onClick={() => props.onSearch(searchValue, dateValue, cityValue)}>
          <FaSearch />
        </button>
      </div>
    );
  }
   
export default EventSearch;  