import './styles/Categories.css';
import { FaBriefcase } from 'react-icons/fa';
import { FaFutbol } from 'react-icons/fa';
import { FaMusic } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';

function Categories() {
    return (
        <div className="categories-container">
            <label aria-hidden="false">
                <FaUsers size={48} />
                <span>Festival</span>
            </label>
            <label aria-hidden="false">
                <FaMusic size={48} />
                <span>Concert</span>
            </label>
            <label aria-hidden="false">
                <FaFutbol size={48} />
                <span>Sport</span>
            </label>
            <label aria-hidden="false">
                <FaBriefcase size={48} />
                <span>Business</span>
            </label>
        </div>
    );
};

export default Categories;
