// import components
import Header from "./Header";
import Footer from "./Footer";

// AboutUs component
function AboutUs() {
  // return a JSX element representing the About Us page
  return (
    <>
     {/* Header component */}
      <Header />
      <div className="background text-black py-5">
        <div className="container">
          <div className="row">
            <div className="col bg-white p-5">
              {/* About Us title */}
              <h3 className="p-2" style={{ fontWeight: "bold" }}>About Us</h3>
              <div className="py-4" style={{ textAlign: "left" }}>
                {/* Welcome message */}
                <p>Welcome to our web3 ticketing platform, where we are revolutionizing the way event tickets are bought and sold. 
                  Our platform is built on the principles of Web3 technology, which is decentralized and secure, providing you with a seamless and trustworthy ticketing experience.</p>
                {/* Mission statement */}
                <p>Our mission is to create a fair and equitable ticketing system that benefits both event organizers and attendees. 
                  By using cryptocurrency as the primary mode of payment, we ensure that transactions are fast, secure, and transparent. 
                  Our platform supports multiple cryptocurrencies, so you can pay using the one that you prefer.</p>
                {/* Unique feature of NFTs */}
                <p>One of the unique features of our platform is that each ticket purchase mints an NFT, providing you with a tangible asset that you can own and trade.
                  This is a game-changer in the ticketing industry, as it provides buyers with additional value beyond just attending an event. 
                  With our NFTs, you can collect them as a hobby, trade them with other collectors, or keep them as a long-term investment.</p>
                 {/* Solving issues in the ticketing industry */}
                <p>We understand that the ticketing industry has been plagued by fraud and scalping, and we are determined to solve these issues through our platform. 
                  With the use of blockchain technology, we ensure that all ticket sales are authentic and can be traced back to their origin. 
                  This creates a secure and trustworthy ticketing ecosystem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </>
  );
}
// export the AboutUs component
export default AboutUs;
