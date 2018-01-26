const express = require('express');
const app = express();
const fs = require('fs');
let spicedPg = require('spiced-pg');
let config = require('./config');
let bodyParser = require('body-parser');
var session = require('express-session');
var Store = require('connect-redis')(session);
let user = require('./models/user');
const csurf = require('csurf');


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

var store = {};
if(process.env.REDIS_URL){
    store = {
        url: process.env.REDIS_URL
    };
} else {
    store = {
        ttl: 3600,
        host: "localhost",
        port: 6379
    };
}

app.use(session({
    store: new Store(store),
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || require('./secrets').sessionSecret
}));

app.use(bodyParser.json({
}));

app.use(bodyParser.json({
    extended: false
}));

const knox = require('knox');
let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: 'fluxlymoppings'
});

app.use(csurf());

//================▲▲▲SET UP▲▲▲=========//

//==============▼▼▼SERVER▼▼▼=======//

app.use(express.static('./public'));


app.get("/pictures", (req, res) => {
    db.query(`SELECT * FROM images order by ID desc LIMIT 12`)
    .then((results) => {
        for (var i=0; i < results.rows.length; i++) {
            results.rows[i].image = config.s3Url.concat(results.rows[i].image);
        }
        res.json({
            results: results.rows,
            csrf: req.csrfToken()
        });
    })
    .catch((err) => {
        console.log("err");
    })
})

app.get("/pictures/:id", (req, res) => {
    db.query(`SELECT * FROM images WHERE id=$1`, [req.params.id])
    .then((results) => {
        if (results.rows.length > 0) {
            results.rows[0].image = config.s3Url.concat(results.rows[0].image);
            res.json(results.rows)
        } else {
            console.log('no image')
            res.status(204).end()
        }
    })
    .catch((err) => {
        console.log(err);
    })
})


app.get("/pictures/page/:page", (req, res) => {
    console.log(req.params.page);
    db.query(`SELECT * FROM images order by ID desc OFFSET $1 LIMIT 12`, [req.params.page * 12])
    .then((results) => {
        if (results.rows.length > 0) {
            for (var i=0; i < results.rows.length; i++) {
                results.rows[i].image = config.s3Url.concat(results.rows[i].image)
                results.rows[i].url = "/#" + results.rows[i].id
            }
            console.log(results.rows + "hi!!");
            res.json(results.rows)
        } else {
            console.log('no image')
            res.status(204).end()
        }
    })
    .catch((err) => {
        console.log(err);
    })
})

app.get('/comments/:id', (req, res) => {
    db.query(
        `SELECT * FROM comments WHERE image_id = $1 order by ID desc`, [req.params.id]
    )
    .then((results) => {
        console.log(results.rows)
        res.json({
            comments: results.rows
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/register', user.checkRegister, (req, res) => {
    user.registerUser(req.body)
    .then((results) => {
        console.log(results.rows[0])
        req.session.user = {
            username: results.rows[0].username,
            id: results.rows[0].id
        };
        if (results) {
            res.json({
                success: true,
                currentUser: results.rows[0].username,
            }).end();
        }
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/login', user.checkLogin, (req, res) => {
    user.loginUser(req.body)
    .then((id) => {
        res.json({
            userid: id
        })
    })
    .catch((err) => {
        console.log(err);
    })
})

app.post('/addComment', (req, res) => {
    db.query(
        `INSERT INTO comments(message, name, image_id) VALUES ($1, $2, $3) returning *`, [req.body.message, req.body.name, req.body.imageId])
    .then((results) => {
        res.json(results.rows);
    })
    .catch((err) => {
        console.log("err");
    })
})

app.post('/upload', uploader.single('file'), function(req, res) {
    if (req.file) {
        let s3Request = client.put("/pics/" + req.file.filename, {
            'Content-Type': req.file.mimetype,
            'Content-Length': req.file.size,
            'x-amz-acl': 'public-read'
        });

        let readStream = fs.createReadStream(req.file.path);
        readStream.pipe(s3Request);

        s3Request.on('response', s3Response => {
            let wasSuccessful = s3Response.statusCode == 200;
            db.query(
                `INSERT INTO images(image, username, title, description) VALUES ($1, $2, $3, $4) returning *`, [req.file.filename, req.body.username, req.body.title, req.body.description])
                .then((results) => {
                    console.log(results.rows)
                    results.rows[0].image = config.s3Url.concat(results.rows[0].image);
                    res.json({
                        success: wasSuccessful,
                        newphoto: results.rows
                    });
                })
                .catch((err) => {
                    console.log("err");
                })
        })
    }
});



app.listen(8080, console.log("battle control online"));
