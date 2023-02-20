import './styles/Home.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import bg from "../images/bg.png"
import { ConnectButton, Select, DatePicker, Input } from "web3uikit";
import { FaSearch } from 'react-icons/fa';

function SearchBar() {
  const [artist, setArtist] = useState("Choose artist");
  const [size, setSize] = useState("Choose size");

  const artists = [
    { id: "atz", label: "Ateez" },
    { id: "tbz", label: "The Boyz" },
    { id: "ptg", label: "Pentagon" },
    { id: "bp", label: "Black Pink" },
  ];

  const sizes = [
    { id: "S", label: "Small" },
    { id: "M", label: "Medium" },
    { id: "L", label: "Large" },
    { id: "XL", label: "Extra Large" },
  ];

  return (
    <div className="search-container">
      <div className="search-inputs">
        <Select
          value={artist}
          onChange={(e) => setArtist(e.value)}
          options={artists}
        />
      </div>
      <div className="search-inputs">
        <Select
          value={size}
          onChange={(e) => setSize(e.value)}
          options={sizes}
        />
      </div>
      <Link to={"/event"} state={{
        artist: artist,
        size: size
      }}>
        <a href="#">
          <FaSearch className="sc mx-2" />
        </a>
      </Link>
    </div>
  );
};


function Home() {
  return (
    <>
      <Header />
      <SearchBar />
      <div className="column">
        <p></p>
        <h1>THIS IS HOME</h1>
        <div className="container">
          <div className="row align-items-center">
            <div className="d-flex">
              <p className="mx-auto">
                <Link to="/event"><button className="btn btn-light">find your next event</button></Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;


