import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

function AboutUs() {

  return (
    <>
      <Header />
      <div className="background text-black py-5">
      <h1 className="mt-2" style={{ fontWeight: "bold" }}>About Us</h1>
        <div className="container">
          <div className="row">
            <div className="col bg-white p-5">
              <div className="py-4" style={{ textAlign: "left" }}>
                <p>Welcome to our web3 ticketing platform, where we are revolutionizing the way event tickets are bought and sold. 
                  Our platform is built on the principles of Web3 technology, which is decentralized and secure, providing you with a seamless and trustworthy ticketing experience.</p>
                <p>Our mission is to create a fair and equitable ticketing system that benefits both event organizers and attendees. 
                  By using cryptocurrency as the primary mode of payment, we ensure that transactions are fast, secure, and transparent. 
                  Our platform supports multiple cryptocurrencies, so you can pay using the one that you prefer.</p>
                <p>One of the unique features of our platform is that each ticket purchase mints an NFT, providing you with a tangible asset that you can own and trade.
                  This is a game-changer in the ticketing industry, as it provides buyers with additional value beyond just attending an event. 
                  With our NFTs, you can collect them as a hobby, trade them with other collectors, or keep them as a long-term investment.</p>
                <p>We understand that the ticketing industry has been plagued by fraud and scalping, and we are determined to solve these issues through our platform. 
                  With the use of blockchain technology, we ensure that all ticket sales are authentic and can be traced back to their origin. 
                  This creates a secure and trustworthy ticketing ecosystem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AboutUs;
