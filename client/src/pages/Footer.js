import { Link } from "react-router-dom";

function Footer() {

  return (
    <>
      <footer className="footer py-3 my-4">
          <p className="text-center text-muted">© Noushin Islam</p>
          <p className="px-2 text-muted"><Link to="/db">Dashboard</Link></p>
      </footer>
    </>
  );
};

export default Footer;