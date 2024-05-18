const express = require('express');
const router = express.Router();
const fs = require('fs');
const pool = require('../db');

// use POST request to get filename and translated text
router.post("/", async (req, res) => {
    const file = req.body.text;
    const filename = req.body.filename;

    console.log(file);
    console.log(filename);

    // Store the data in PostgreSQL
    try {
        const queryText = 'INSERT INTO translations(filename, text) VALUES($1, $2) RETURNING *';
        const values = [filename, file];
        const result = await pool.query(queryText, values);
        console.log('Data stored:', result.rows[0]);
    } catch (err) {
        console.error('Error storing data:', err);
        res.status(500).send('Server error');
        return;
    }

    // create file and write file with the translated text
    fs.writeFile(`routes/${filename}`, file, (err) => {
        if (err) return (err);
    });

    // send file for download to frontend
    router.get('/', function (req, res, next) {
        res.download(`routes/${filename}`);
        console.log('server is running');
    });

    res.status(200).send('File processed and data stored');
});

// Fetch stored translations
router.get("/translations", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM translations');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
