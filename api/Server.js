const express = require('express');
const mysql = require('mysql2');
const Web3 = require('web3');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;
require('dotenv').config();

//const contractAddress = ""; //goerli
const provider = new Web3('https://rpc-mumbai.maticvigil.com/');
const web3 = new Web3(provider);
const contractAddress = "0x2d2Fdb2aF9723FDFEc66354c5cF9E3Ff025FA114";
app.use(express.json());
app.use(cors());


// create connection to mysql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'project'
});

// confirm db connection
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to database!');
});

// linked abi
const abi = require("./contractABI.json");

// function to get smart contract
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

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// get events from mysql
app.get("/events/sql", async (req, res) => {
    const { name, date, city } = req.query;
    let sql = "SELECT * FROM events";

    if (name || date || city) {
        sql += " WHERE";
        if (name) {
            sql += ` event_name LIKE '%${name}%'`;
        }
        if (date) {
            sql += `${name ? " AND" : ""} event_date = '${date}'`;
        }
        if (city) {
            sql += `${name || date ? " AND" : ""} city = '${city}'`;
        }
    }

    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


// get events from blockchain
app.get('/events/matic', async (req, res) => {
    try {
        const contract = await getContract();
        const event = await contract.methods.getEvents().call();
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting events');
    }
});

// get event by id from mysql
app.get('/events/sql/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const sql = 'SELECT * FROM events WHERE event_id = ?';
        connection.query(sql, [id], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(404).send('Event not found');
            }
            res.send(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting event');
    }
});

// get event by id from blockchain
app.get('/events/matic/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const contract = await getContract();
        const event = await contract.methods.getEvent(id).call();
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting event');
    }
});

// create event in sql and on blockchain
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

/* app.put('/events/:id', (req, res) => {
    const id = req.params.id;
    const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer } = req.body;
    const sql = 'UPDATE events SET event_name = ?, city = ?, venue = ?, img_url = ?, event_description = ?, event_date = ?, start_time = ?, end_time = ?, total_tickets = ?, price_per_ticket = ?, organizer = ? WHERE event_id = ?';
    connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, id], (err, result) => {
        if (err) throw err;
        console.log(`Event with ID ${id} updated`);
        res.send('Event updated');
    });
}); */

// delete event in sql and on blockchain
app.delete('/events/:id/:address', async (req, res) => {
    try {
        const id = req.params.id;
        const address = req.params.address;
        const sql = 'DELETE FROM events WHERE event_id = ?';
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [id], (err, result) => {
                if (err) reject(err);
                resolve(result);
            });
        });
        const contract = await getContract();
        const gasPrice = await web3.eth.getGasPrice();
        const options = { gasPrice: gasPrice, gasLimit: 5000000, from: address };
        const event = await contract.methods.deleteEvent(id).send(options);
        console.log(`Event with ID ${id} deleted`);
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// book ticket in sql and on blockchain
app.post('/transactions/:id/:address', async (req, res) => {
    try {
        const id = req.params.id;
        const address = req.params.address;
        const { num_tickets } = req.body;

        // Get event information from the database
        const sql = 'SELECT * FROM events WHERE event_id = ?';
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [id], async (err, result) => {
                if (err) reject(err);
                if (result.length === 0) {
                    return res.status(404).send('Event not found');
                }
                resolve(result[0]);
            });
        });

        // Calculate the total price of the tickets
        //const totalPrice = web3.utils.toWei(result.price_per_ticket.toString(), 'ether');
        //const totalPrice = result.price_per_ticket * num_tickets;
        const totalPrice = result.price_per_ticket * num_tickets;

        // Get the contract instance and gas price
        const contract = await getContract();
        const gasPrice = await web3.eth.getGasPrice();
        const options = {
            from: address,
            to: "0x55Abb41068D21E86b89304F2AB80C6597F8F5096",
            gasPrice: gasPrice,
            gasLimit: 5000000,
            value: Moralis.Units.MATIC(totalPrice)
        };

        // Call the bookTickets function
        const tx = await contract.methods.bookTickets(id, num_tickets).send(options);

        // Return the transaction receipt
        res.send(tx);
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

// port number
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
