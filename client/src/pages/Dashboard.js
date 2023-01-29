import './styles/Dashboard.css';
import { Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <>
      <Header />
      <div className="column">
        <p></p>
        <h1>THIS IS DASHBOARD</h1>
        <div className="container">
          
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;