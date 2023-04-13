import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './styles/Footer.css';


function Footer() {

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="text-muted">
            <div className="footer-cr">
              <p>&copy; Noushin Islam</p>
            </div>
            <div className="footer-links">
              <Link to="/aboutus" className="mx-2 text-muted">About Us</Link>
              <Link to="/faq" className="mx-2 text-muted">FAQ</Link>
              <Link to="/privacy" className="mx-2 text-muted">Privacy</Link>
            </div>
          </div>
          <div className="footer-sns text-muted">
            <a href="www.facebook.com">
              <FaFacebook className="fb mx-2" />
            </a>
            <a href="www.instagram.com">
              <FaInstagram className="ig mx-2" />
            </a>
            <a href="https://www.linkedin.com/in/noushin-islam-bz/">
              <FaLinkedinIn className="ig mx-2" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
