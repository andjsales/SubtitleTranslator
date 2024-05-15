const express = require('express');
const router = express.Router();
const fs = require('fs');

// use POST request to get filename and translated text
router.post("/", (req, res) => {
    const file = req.body.text;
    const filename = req.body.filename;

    console.log(file);
    console.log(filename);

    // create file and write file with the translated text
    const field = fs.writeFile(`routes/${filename}`, req.body.text, (err) => {
        if (err) return (err);
    });

    // send file for download to frontend
    router.get('/', function (req, res, next) {
        res.download(`routes/${filename}`);
        console.log('server is running');
    });
});


module.exports = router;
