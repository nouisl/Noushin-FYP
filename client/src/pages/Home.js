import './styles/Home.css';
import { Link } from "react-router-dom";
import { React, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ConnectButton, Select, DatePicker, Input } from "web3uikit";
import { FaSearch } from 'react-icons/fa';
import logo from "../images/logo7.png"

// function SearchBar() {
//   const [artist, setArtist] = useState("Choose artist");
//   const [size, setSize] = useState("Choose size");

//   const artists = [
//     { id: "atz", label: "Ateez" },
//     { id: "tbz", label: "The Boyz" },
//     { id: "ptg", label: "Pentagon" },
//     { id: "bp", label: "Black Pink" },
//   ];

//   const sizes = [
//     { id: "S", label: "Small" },
//     { id: "M", label: "Medium" },
//     { id: "L", label: "Large" },
//     { id: "XL", label: "Extra Large" },
//   ];

//   return (
//     <div className="search-container">
//       <div className="search-inputs">
//         <Select
//           value={artist}
//           onChange={(e) => setArtist(e.value)}
//           options={artists}
//         />
//       </div>
//       <div className="search-inputs">
//         <Select
//           value={size}
//           onChange={(e) => setSize(e.value)}
//           options={sizes}
//         />
//       </div>
//       <Link to={"/event"} state={{
//         artist: artist,
//         size: size
//       }}>
//         <a href="#">
//           <FaSearch className="sc mx-2" />
//         </a>
//       </Link>
//     </div>
//   );
// };


function Home() {
  return (
    <>
      <Header />
      <div class="home">
        <div class="home-content">
          <h1>Buy and discover the tickets of tomorrow</h1>
          <p>Ticket3 is an innovative web ticketing solution that uses Blockchain technology to solve the problem of ticket fraud.</p>
          <a href="/event" class="btn-primary">Explore</a>
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
