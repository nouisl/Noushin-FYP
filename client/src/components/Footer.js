import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedinIn} from 'react-icons/fa';
import './styles/Footer.css';

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
              <Link to="/privacy"><a className="mx-2 text-muted">Privacy</a></Link>
            </div>
          </div>
          <div className="footer-sns text-muted">
            <a href="#">
              <FaFacebook className="fb mx-2" />
            </a>
            <a href="#">
              <FaInstagram className="ig mx-2" />
            </a>
            <a href="#">
              <FaLinkedinIn className="ig mx-2" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;