const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

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

// events

app.get('/events', (req, res) => {
    const sql = 'SELECT * FROM events';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get('/events/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM events WHERE event_id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            return res.status(404).send('Event not found');
        }
        res.send(result);
    });
});

app.post('/events', (req, res) => {
    const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer } = req.body;
    const sql = 'INSERT INTO events (event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer], (err, result) => {
        if (err) throw err;
        console.log(`Event with ID ${result.insertId} added`);
        res.send('Event added');
    });
});

app.put('/events/:id', (req, res) => {
    const id = req.params.id;
    const { event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer } = req.body;
    const sql = 'UPDATE events SET event_name = ?, city = ?, venue = ?, img_url = ?, event_description = ?, event_date = ?, start_time = ?, end_time = ?, total_tickets = ?, price_per_ticket = ?, organizer = ? WHERE event_id = ?';
    connection.query(sql, [event_name, city, venue, img_url, event_description, event_date, start_time, end_time, total_tickets, price_per_ticket, organizer, id], (err, result) => {
        if (err) throw err;
        console.log(`Event with ID ${id} updated`);
        res.send('Event updated');
    });
});

app.delete('/events/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM events WHERE event_id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) throw err;
        console.log(`Event with ID ${id} deleted`);
        res.send('Event deleted');
    });
});

// transactions
app.post('/transactions', (req, res) => {
    const { tx_hash, from_address, to_address, value } = req.body;
    const sql = 'INSERT INTO transactions (tx_hash, from_address, to_address, value) VALUES (?, ?, ?, ?)';
    connection.query(sql, [tx_hash, from_address, to_address, value], (err, result) => {
        if (err) throw err;
        console.log(`Transaction with ID ${result.insertId} added`);
        res.send('Transaction added');
    });
});

app.get('/transactions', (req, res) => {
    const sql = 'SELECT * FROM transactions';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
