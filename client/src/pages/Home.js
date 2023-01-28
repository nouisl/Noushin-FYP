import './styles/Home.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer"; 

function Home() {
  return (
    <>
      <Header />
      <div>
        <p></p>
        <h1>THIS IS HOME</h1>
      </div>
      <Footer />
    </>
  );
};

export default Home;

