import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedinIn} from 'react-icons/fa';
import './styles/Footer.css';
import Privacy from './Privacy.js';

function Footer() {
 
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="text-muted">
            <div className="footer-cr">
              <a>&copy; Noushin Islam</a>
            </div>
            <div className="footer-links">
              <Link to="/aboutus"><a className="mx-2 text-muted">About Us</a></Link>
              <Link to="/faq"><a className="mx-2 text-muted">FAQ</a></Link>
              <Privacy/>
            </div>
          </div>
          <div className="footer-sns text-muted">
            <a>
              <FaFacebook className="fb mx-2" />
            </a>
            <a>
              <FaInstagram className="ig mx-2" />
            </a>
            <a>
              <FaLinkedinIn className="ig mx-2" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;