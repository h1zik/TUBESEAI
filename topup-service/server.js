const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

const SECRET_KEY = 'your_secret_key';

const db = mysql.createConnection({
    host: 'mysql', // Ensure this matches your setup
    user: 'root',
    password: 'root',
    database: 'topup_service_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');

    db.query('CREATE TABLE IF NOT EXISTS transactions (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, amount DECIMAL(10, 2), timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)', (err) => {
        if (err) throw err;
    });
});

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'Token is missing!' });
    }

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid!' });
        }
        req.user_id = decoded.user_id;
        next();
    });
}

// Handle preflight requests
app.options('*', cors());

app.post('/topup', verifyToken, async (req, res) => {
    const { amount } = req.body;
    const user_id = req.user_id;

    db.query('INSERT INTO transactions (user_id, amount) VALUES (?, ?)', [user_id, amount], async (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Log the token being sent to user-service
        const token = req.headers['authorization'];
        console.log('Token being sent to user-service:', token);

        // Update user balance in user-service
        try {
            const response = await axios.put(
                'http://user-service:5000/update_balance', // Ensure this matches your setup
                { amount },
                { headers: { Authorization: token } }
            );
            console.log('User balance updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating balance:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'Failed to update user balance' });
            return;
        }

        res.status(201).json({ message: 'Top-up successful', transactionId: result.insertId });
    });
});

app.get('/transactions/:user_id', verifyToken, (req, res) => {
    const { user_id } = req.params;
    db.query('SELECT * FROM transactions WHERE user_id = ?', [user_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.put('/transactions/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    db.query('UPDATE transactions SET amount = ? WHERE id = ?', [amount, id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Transaction updated successfully' });
    });
});

app.delete('/transactions/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM transactions WHERE id = ?', [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Transaction deleted successfully' });
    });
});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Top-up service running on port ${PORT}`);
});