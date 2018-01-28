DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(320) NOT NULL,
    hashpass VARCHAR(320) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    anonymous BOOLEAN NOT NULL
);

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    title VARCHAR(255) NOT NULL,
    username VARCHAR(100) REFERENCES users(username) NOT NULL,
    description TEXT,
    hashtags VARCHAR(1000),
    user_id INTEGER REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    message VARCHAR(1000) NOT NULL,
    username VARCHAR(100) REFERENCES users(username) NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    image_id INTEGER REFERENCES images(id) NOT NULL,
    hashtags VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, email, hashpass) VALUES ('ANON', 'ANON@ANON.ANON', '398fva93evaakjnfaefaeflksjefsoiefhzvjnzejvnez');

INSERT INTO images (image, username, title, description) VALUES ('MQwozP4QM5uK84XgPs4Q0oUIVWiwzN-w.jpg', 'funkychicken', 'Welcome to Berlin and the future!', 'This photo brings back so many great memories.');
INSERT INTO images (image, username, title, description) VALUES ('wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg', 'discoduck', 'Elvis', 'We can''t go on together with suspicious minds.');
INSERT INTO images (image, username, title, description) VALUES ('XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg', 'discoduck', 'Hello Berlin', 'This is going to be worth a lot of money one day.');


ALTER TABLE comments

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(320) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
