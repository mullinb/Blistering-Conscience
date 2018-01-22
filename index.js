const express = require('express');
const app = express();
let spicedPg = require('spiced-pg');
let config = require('./config')

let dbUrl = process.env.DATABASE_URL || `postgres:${require('./secrets').dbUser}@localhost:5432/imageboard`;

let db = spicedPg(dbUrl);

var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static('./public'));

app.get("/pictures", (req, res) => {
    db.query(`SELECT * FROM images`)
    .then((results) => {
        for (var i=0; i < results.rows.length; i++) {
            results.rows[i].image = config.s3Url.concat(results.rows[i].image);
        }
        res.json(results.rows);
    })
})

app.post('/upload', uploader.single('file'), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

app.listen(8080, console.log("battle control online"));
