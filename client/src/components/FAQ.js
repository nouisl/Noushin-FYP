import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

function AboutUs() {

  return (
    <>
      <Header />
      <div className="background text-black py-5">
        <div className="container">
          <div className="row">
            <div className="col bg-white p-5">
              <h3 className="my-2" style={{ fontWeight: "bold" }}>FAQ</h3>
              <div className="py-4" style={{ textAlign: "left" }}>
                <div class="accordion accordion-flush" id="accordionFlushExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      How do I receive my tickets after purchase?
                      </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                      <div class="accordion-body">After completing your purchase, your tickets will be automatically minted as NFTs and stored in your connected wallet. You can view your NFT tickets in your wallet's NFT collection.</div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingTwo">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                      Can I transfer or resell my NFT tickets?
                      </button>
                    </h2>
                    <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                      <div class="accordion-body">This is function is in place for the foreseeable future, however, at this moment this function is not available on Ticket3. </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingThree">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                      What happens if the event is cancelled or postponed?
                      </button>
                    </h2>
                    <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                      <div class="accordion-body">A: In the event of a cancellation or postponement, our platform will automatically issue a refund in the form of the cryptocurrency used for the purchase.</div>
                    </div>
                  </div>
                  {/* <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingFour">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                      Are there any fees associated with purchasing tickets with cryptocurrency?
                      </button>
                    </h2>
                    <div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                      <div class="accordion-body">Our platform charges a small processing fee for each ticket purchase. In addition, there may be transaction fees associated with sending cryptocurrency from your wallet to ours. Please refer to your wallet provider's information for more details on transaction fees.</div>
                    </div>
                  </div> */}
                </div>
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
