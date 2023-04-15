import './styles/Home.css';
import { useContext } from "react";
import { Web3Context } from '../Web3Context.js';
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../images/logo7.png"

function Home() {
  const { account, loadWeb3, handleLogout } = useContext(Web3Context);

  return (
    <>
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
      <Footer />
    </>
  );
};

export default Home;
