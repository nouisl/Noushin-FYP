const express = require('express');
const mysql = require('mysql2');
const Web3 = require('web3');
const cors = require('cors');
const app = express();
const port = 4000;
require('dotenv').config();

const provider = new Web3('https://rpc-mumbai.maticvigil.com/');
const web3 = new Web3(provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
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

// get
app.get('/', (req, res) => {
    res.send('Welcome!');
});

// get events from mysql
app.get("/events/sql", async (req, res) => {
    const { name, date, city, category } = req.query;
    let sql = "SELECT * FROM events";
    if (name || date || city || category) {
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
        if (category) {
            sql += `${name || date || city ? " AND" : ""} category = '${category}'`;
        }
    }
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
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

// get all unique cities from mysql
app.get('/events/cities', async (req, res) => {
    try {
        const sql = 'SELECT DISTINCT city FROM events';
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// get all unique categories from mysql
app.get('/events/categories', async (req, res) => {
    try {
        const sql = 'SELECT DISTINCT category FROM events';
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.json(result);
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// create event in sql and on blockchain
app.post('/events/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, tickets_sold, category } = req.body;
        const sql = 'INSERT INTO events (event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, tickets_sold, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result = await new Promise((resolve, reject) => {
            connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, tickets_sold, category], (err, result) => {
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

// put event by id in mysql
app.put('/events/:id', (req, res) => {
    try {
        const id = req.params.id;
        const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, tickets_sold, category } = req.body;
        const sql = 'UPDATE events SET event_name = ?, city = ?, venue = ?, img_url = ?, event_description = ?, event_date = ?, start_time = ?, end_time = ?, total_tickets = ?, price_per_ticket = ?, organizer = ?, tickets_sold = ?, category = ? WHERE event_id = ?';
        connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, tickets_sold, category ], (err, result) => {
            if (err) throw err;
            console.log(`Event with ID ${id} updated`);
            res.send('Event updated');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

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

// get tickets from mysql
app.get("/api/tickets", async (req, res) => {
    try {
        let sql = "SELECT * FROM tickets";
        connection.query(sql, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// get tickets from mysql by address
app.get('/tickets/:account', async (req, res) => {
    try {
        const account = req.params.account;
        const sql = 'SELECT * FROM tickets WHERE customer_address = ?';
        connection.query(sql, [account], (err, result) => {
            if (err) throw err;
            if (result.length === 0) {
                return res.status(404).send('No tickets found.');
            }
            res.send(result[0]);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting tickets.');
    }
});

// post tickets to mysql
app.post('/api/tickets', async (req, res) => {
    const { tokenIds, blockHash, timestamp, sender, eventId, totalPrice } = req.body;
    console.log('tokenIds:', tokenIds);
    try {
        for (const tokenId of tokenIds) {
            const insertQuery = 'INSERT INTO tickets(token_id, tx_hash, tx_time, value, customer_address, event_id) VALUES(?, ?, ?, ?, ?, ?)';
            const insertValues = [tokenId, blockHash, new Date(timestamp * 1000), totalPrice / tokenIds.length, sender, eventId];
            connection.query(insertQuery, insertValues, (error) => {
                if (error) {
                    console.error('Error inserting data into tickets table:', error);
                    return;
                }
            });
        }
        res.json({ message: 'Tickets added successfully' });
    } catch (e) {
        console.error('Error in /api/tickets endpoint:', e);
    }
});

// put ticket_sold in mysql by id
app.put('/api/events/:event_id', (req, res) => {
    const { event_id } = req.params;
    const { num_tickets } = req.body;

    const updateQuery = 'UPDATE events SET tickets_sold = tickets_sold + ? WHERE event_id = ?';
    const updateValues = [num_tickets, event_id];

    connection.query(updateQuery, updateValues, (error) => {
        if (error) {
            console.error('Error updating tickets_sold value:', error);
            res.status(500).send('Error updating tickets_sold value');
            return;
        }
        res.json('Updated successfully');
    });
});

// port number
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


// all blockchain functions that can be implemented if I pass user credentials from frontend to backend

// get events from blockchain
/* app.get('/events/matic', async (req, res) => {
    try {
        const contract = await getContract();
        const event = await contract.methods.getEvents().call();
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting events');
    }
}); */

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

// book ticket on blockchain
/* app.post('/transactions/:id/:address', async (req, res) => {
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
        const totalPrice = result.price_per_ticket * num_tickets;

        // Get the contract instance and gas price
        const contract = await getContract();
        const gasPrice = await web3.eth.getGasPrice();
        const options = {
            from: address,
            to: "0x55Abb41068D21E86b89304F2AB80C6597F8F5096",
            gasPrice: gasPrice,
            gasLimit: 5000000,
            value: web3.utils.toWei(web3.utils.toBN(totalPrice))

        };

        // Call the bookTickets function
        const tx = await contract.methods.bookTickets(id, num_tickets).send(options);

        // Return the transaction receipt
        res.send(tx);
    } catch (error) {
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
        const totalPrice = result.price_per_ticket * num_tickets;
        console.error(web3.utils.toWei(web3.utils.toBN(totalPrice)));
        res.status(500).send('Internal Server Error');
    }
}); */