// import necessary components and libraries
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from 'react-icons/fa';

// EventSearch component
function EventSearch(props) {
    // use the useState hook to define state variables
    const [searchValue, setSearchValue] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [cityValue, setCityValue] = useState("");
    const [catValue, setCatValue] = useState("");
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState([]);

    // use the useEffect hook to fetch data when the component mounts
    useEffect(() => {
        async function fetchCities() {
            // fetch data from API using axios
            const response = await axios.get('http://localhost:4000/events/cities');
            const cityNames = response.data.map(cityObj => cityObj.city);
            // update the cities state variable
            setCities(cityNames);
        }
        fetchCities();
        async function fetchCategories() {
            // fetch data from API using axios
            const response = await axios.get('http://localhost:4000/events/categories');
            const cats = response.data.map(catObj => catObj.category);
            // update the categories state variable
            setCategories(cats);
        }
        fetchCategories();
    }, []);

    // define a function to reset the search fields
    function handleReset() {
        setSearchValue("");
        setDateValue("");
        setCityValue("");
        setCatValue("");
        props.onSearch("", "", "");
    }
    
    // return a form containing search fields and buttons
    return (
        <div className="event-search">
            <div>
                {/* Input field for search by name */}
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ margin: '1rem', width: '13rem', height: '2rem', fontSize: '1rem' }}
                />
                {/* Input field for filter by date */}
                <input
                    type="date"
                    placeholder="Filter by date"
                    value={dateValue}
                    onChange={(e) => setDateValue(e.target.value)}
                    style={{ margin: '1rem', width: '13rem', height: '2rem', fontSize: '1rem' }}
                />
                {/* Select element for filter by city */}
                <select
                    value={cityValue}
                    onChange={(e) => setCityValue(e.target.value)}
                    style={{ margin: '1rem', width: '13rem', height: '2rem', fontSize: '1rem' }}
                >
                    <option value="">All cities</option>
                    {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
                {/* Select element for filter by category */}
                <select
                    value={catValue}
                    onChange={(e) => setCatValue(e.target.value)}
                    style={{ margin: '1rem', width: '13rem', height: '2rem', fontSize: '1rem' }}
                >
                    <option value="">All categories</option>
                    {/* Map over the categories array to create options */}
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
             {/* Button to reset the search fields */}
            <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
                style={{ margin: '1rem' }}
            >
                <FaTimes />
            </button>
            {/* Button to perform a search */}
            <button
                className="btn btn-outline-danger"
                onClick={() => props.onSearch(searchValue, dateValue, cityValue, catValue)}
                style={{ margin: '1rem' }}
            >
                <FaSearch />
            </button>
        </div>
    );
}
// export the EventSearch component
export default EventSearch;
