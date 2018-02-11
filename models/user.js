let spicedPg = require('spiced-pg');

let dbUrl = process.env.DATABASE_URL || `postgres:${require('../secrets').dbUser}@localhost:5432/imageboard`;

let db = spicedPg(dbUrl);

let bcrypt = require('bcryptjs');

exports.checkRegister = (req, res, next) => {
    let {username, email, password1, password2} = req.body;
    let holdEmail = email;
    if (username.indexOf(" ") >= 0) {
        res.json({
            error: 0
        }).end();
    } else if (!username.length > 0) {
        username = "Anonymous";
    } else if (!email.length > 0 || email.indexOf(" ") >= 0 || email.split("@").length !== 2) {
        res.json({
            error: 1
        }).end();
    } else if (!password1.length > 0 || password1.indexOf(" ") >= 0 || password1 !== password2)  {
        res.json({
            error: 2
        }).end();
    } else {
        email = holdEmail;
        next();
    }
}

exports.registerUser = ({username, email, password1}) => {
    return exports.hashPassword(password1)
        .then((hash) => {
            return db.query(
            `INSERT INTO users (username, email, hashpass, anonymous) VALUES ($1, $2, $3, 'false') RETURNING username, id`, [username, email, hash])
        })
}

exports.checkLogin = (req, res, next) => {
    let {username, password} = req.body;
    if (!(username.length > 0)) {
        res.json({
            error: 0
        }).end();
    } else if (!(password.length > 0)) {
        res.json({
            error: 1
        }).end();
    } else {
        next();
    }
}
exports.loginUser = ({username, password}) => {
    return db.query(
        `SELECT hashpass FROM users WHERE username = $1`, [username]
    )
    .then((result) => {
        return exports.checkPassword(password, result.rows[0].hashpass)
    })
    .then((match) => {
        if (match) {
            return db.query(
                `SELECT * FROM users WHERE username = $1`, [username]
            )
            .then((results) => {
                return results;
            })
        } else {
            throw new Error ("passwords do not match.");
        }
    })
}

exports.hashPassword = (plainTextPassword) => {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

exports.checkPassword = (textEnteredInLoginForm, hashedPasswordFromDatabase) => {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}
