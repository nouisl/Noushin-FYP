import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from 'react-icons/fa';

function EventSearch(props) {
    const [searchValue, setSearchValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [cityValue, setCityValue] = useState("");
    const [cities, setCities] = useState([]);

    useEffect(() => {
        async function fetchCities() {
            const response = await axios.get('http://localhost:4000/events/cities');
            const cityNames = response.data.map(cityObj => cityObj.city);
            setCities(cityNames);
        }
        fetchCities();
    }, []);

    function handleReset() {
        setSearchValue("");
        setDateValue("");
        setCityValue("");
        props.onSearch("", "", "");
    }

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="event-search">
            <div>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ margin: '1rem', width: '18rem', height: '2rem', fontSize: '1rem' }}
                />
                <input
                    type="date"
                    placeholder="Filter by date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    style={{ margin: '1rem', width: '18rem', height: '2rem', fontSize: '1rem' }}
                />
                <select
                    value={cityValue}
                    onChange={(e) => setCityValue(e.target.value)}
                    style={{ margin: '1rem', width: '18rem', height: '2rem', fontSize: '1rem' }}
                >
                    <option value="">All cities</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                style={{ margin: '1rem' }}
            >
                <FaTimes />
            </button>
            <button
                className="btn btn-outline-danger"
                onClick={() => props.onSearch(searchValue, dateValue, cityValue)}
                style={{ margin: '1rem' }}
            >
                <FaSearch />
            </button>
        </div>
    );
}

export default EventSearch;
