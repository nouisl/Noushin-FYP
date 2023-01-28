import { Link } from "react-router-dom";
import './styles/Header.css';

function Header() {
  return (
    <>
      <nav>
        <div className="logo" >
          <Link to="/">
            <img src="https://www.carnival.com/-/media/images/header2013/carnival-logo-png.png" alt="Carnival Home Page" />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;