# Ticket3

Ticket3 is a web-based solution that provides a secure and user-friendly ticketing experience. The platform is built using the latest web technologies, focusing on providing a seamless experience for users and ensuring transparency and security. It employs blockchain technology, cryptocurrency, and non-fungible tokens (NFTs) to enhance the security, transparency, and efficiency of traditional web ticketing.
With the growing concerns around ticket fraud, the issue of limited transparency and accountability seems to be the cause. Thus, Ticket3 aims to create a secure and reliable solution to eliminate the need for third-party providers. To do so, the application utilises a smart contract that executes predetermined conditions when interacted with. The smart contract uses the ERC721 token standard to create NFTs for event tickets. Using NFTs ensures proof of authenticity and ownership, as every transaction on the blockchain is publicly visible and verifiable. This way, maximum transparency is achieved by removing any intermediary and using NFTs.
The Ticket3 platform offers various features for users. Event attendees can discover and purchase tickets. Tickets can be purchased exclusively with cryptocurrency.

### This repository contains the source code and implementation of the Ticket3 platform.

<br /> **The tech stack consists of the following components**:
- Frontend: JavaScript with React is used for developing the frontend of the Ticket3 platform.
- Backend: Node.js is utilized for the backend development of Ticket3 to write RESTful API. 
- Database: MySQL is chosen as the database management system for Ticket3. 
- Blockchain: Solidity is the programming language used for developing smart contracts on the Ethereum blockchain in this project. 

## Installation Guide:

<br /> To run and create one’s own version of Ticket3, follow the following instructions:
1. Install the MetaMask extension in your primary browser and set up an account with funds collected from faucets. This is required for making transactions on the Ethereum blockchain.
2. Create tables “events” and “tickets” in the MySQL database.This can by logging and running the following queries:
Figure 25: MySQL queries to create tables.
3. Replace the MySQL information in server.js with the updated information.
4. Set the wallet private key environmental variable in server.js with the contract owner’s private key and set the Google Maps API key environmental variable in EventsMap.js to a new API key.
5. Download or clone the project folder.
6. Fetch the smart contract code from WebTicketing.sol and compile and deploy it.
7. In the "api" and "client" directories of the project, replace the contractAddressvariable in the web3.js files with the new address.
8. Open project folder and navigate to the directory named “api” on it and run the following commands to install the necessary dependencies and start the server:
`“npm install” and “npm start”`
9. In a new terminal window, navigate to the “client“ directory of the project and repeat the same by running the following commands: `“npm install” and “npm start“`
10. The web app will open automatically on the localhost at port 3000.

 
This way, one can create a new web app to manage events, sell tickets, and view transaction history on the Ethereum blockchain using Ticket3’s source code.
