import './styles/Categories.css';
import { useState } from "react";
import { FaStar } from 'react-icons/fa';
import { FaPlane } from 'react-icons/fa';
import { FaFutbol } from 'react-icons/fa';
import { FaMusic } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';

function Categories(props) {
    const [category, setCategory] = useState("");

    return (
        <div className="categories-container">
            <label aria-hidden="false" value={category} onClick={(e) => setCategory(e.target.value)}>
                <FaStar size={48} />
                <span>All</span>
            </label>
            <label aria-hidden="false" value={category} onClick={(e) => setCategory(e.target.value)}>
                <FaUsers size={48} />
                <span>Festival</span>
            </label>
            <label aria-hidden="false" value={category} onClick={(e) => setCategory(e.target.value)}> 
                <FaMusic size={48} />
                <span>Concert</span>
            </label>
            <label aria-hidden="false">
                <FaFutbol size={48} />
                <span>Sport</span>
            </label>
            <label aria-hidden="false">
                <FaPlane size={48} />
                <span>Travel</span>
            </label>
        </div>
    );
};

export default Categories;
