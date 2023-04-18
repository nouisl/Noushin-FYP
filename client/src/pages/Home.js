// import styles and components
import './styles/Home.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../images/logo.png"

// Home page component
function Home() {
  
  // return a JSX element representing the Home page
  return (
    <>
    {/* Header component */}
      <Header />
      <div class="home">
        <div class="home-content">
          <h1>Buy and discover the tickets of tomorrow</h1>
          <p>Ticket3 is an innovative web ticketing solution that uses Blockchain technology to solve the problem of ticket fraud.</p>
          <a href="/event" class="btn-primary hpb">Explore Events</a>
        </div>
        <div class="home-logo">
          <img src={logo} alt="Logo" />
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </>
  );
};

// export the Home page component
export default Home;