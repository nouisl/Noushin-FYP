import './styles/Home.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
//import bg from "../images/image.png"

function Home() {
  return (
    <>
      <Header />
      <div className="column">
        <p></p>
        <h1>THIS IS HOME</h1>
        <div className="container">
          <div className="row align-items-center">
            <div className="d-flex">
              <p className="mx-auto">
                <Link to="/db"><button className="btn btn-light">start shopping now</button></Link>
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