const express = require('express');
const mysql = require('mysql2');
//const ethers = require('ethers');
const Web3 = require('web3');
const axios = require('axios');
const app = express();
const port = 3000;

//const contractAddress = ""; //goerli
const provider = new Web3('https://rpc-mumbai.maticvigil.com/');
const web3 = new Web3(provider);
const contractAddress = "0x02B6c469D7219d7aC3a0997Db9A3B92e4C020673";
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'project'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');
});

const abi = require("./contractABI.json");

async function getContract() {
    try {
        const privateKey = process.env.private_key;
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        const contract = new web3.eth.Contract(abi, contractAddress);
        return contract;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

app.get('/events', async (req, res) => {
    const sql = 'SELECT * FROM events';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/events/:id', async (req, res) => {
    try {
        const id = req.params.id;
        //const address = "0xC515B97D0E99175De9d4c7C1C6660e05542511Ea";
        /* const sql = 'SELECT * FROM events WHERE event_id = ?';
        connection.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(404).send('Event not found');
            }
            res.send(result[0]);
        }); */
        const contract = await getContract();
        //const gasPrice = await web3.eth.getGasPrice();
        //const options = { gasPrice: gasPrice, gasLimit: 5000000, from: address };
        const event = await contract.methods.getEvent(id).call();
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting event');
    }
});

// app.get('/events/:id', async (req, res) => {
//     try {
//         const id = ethers.getBigInt(req.params.id);
//         const contract = await getContract();
//         const event = await contract.getEvent(id);
//         res.send(event);

// });

app.post('/events/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer } = req.body;
        const sql = 'INSERT INTO events (event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        const eventId = result.insertId;
        const name = event_name;
        const totalTickets = total_tickets;
        const pricePerTicket = price_per_ticket;
        const contract = await getContract();
        const gasPrice = await web3.eth.getGasPrice();
        const options = { gasPrice: gasPrice, gasLimit: 5000000, from: address };
        const event = await contract.methods.createEvent(eventId, name, totalTickets, pricePerTicket).send(options);
        console.log(`Event with ID ${eventId} added`);
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// app.put('/events/:id', (req, res) => {
//     const id = req.params.id;
//     const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer } = req.body;
//     const sql = 'UPDATE events SET event_name = ?, city = ?, venue = ?, img_url = ?, event_description = ?, event_date = ?, start_time = ?, end_time = ?, total_tickets = ?, price_per_ticket = ?, organizer = ? WHERE event_id = ?';
//     connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, id], (err, result) => {
//         if (err) throw err;
//         console.log(`Event with ID ${id} updated`);
//         res.send('Event updated');
//         const tokenURI = `https://localhost:3001/events/${id}`;
//         contract.mint(tokenURI).then((tx) => {
//             console.log("Token minted:", tx.hash);
//             res.send(`Event created with token ID ${tx.tokenId}`);
//         }).catch((err) => {
//             console.error("Error minting token:", err);
//             res.status(500).send("Error creating event");
//         });
//     });
// });

// app.delete('/events/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = 'DELETE FROM events WHERE event_id = ?';
//     connection.query(sql, [id], (err, result) => {
//         if (err) throw err;
//         console.log(`Event with ID ${id} deleted`);
//         res.send('Event deleted');
//     });
// });

// // transactions

/* app.post('/transactions', (req, res) => {
    const { tx_hash, from_address, to_address, value } = req.body;
    const sql = 'INSERT INTO transactions (tx_hash, from_address, to_address, value) VALUES (?, ?, ?, ?)';
    connection.query(sql, [tx_hash, from_address, to_address, value], (err, result) => {
        if (err) throw err;
        console.log(`Transaction with ID ${result.insertId} added`);
        res.send('Transaction added');
    });

}); */

app.post('/transactions/:address', async (req, res) => {
    try {
        const { event_id, num_tickets } = req.body;
        const address = req.params.address;
        const id = event_id;
        const tickets = num_tickets;
        const contract = await getContract();
        const gasPrice = await web3.eth.getGasPrice();
        const options = { gasPrice: gasPrice, gasLimit: 5000000, from: address };
        const event = await contract.methods.bookTickets(id, tickets).send(options);
        console.log(`Booking completed`);
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// app.get('/transactions', (req, res) => {
//     const sql = 'SELECT * FROM transactions';
//     connection.query(sql, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
