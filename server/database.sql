CREATE DATABASE bpl;

CREATE TABLE users(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (email)
);

-- insert fake users
INSERT INTO users (first_name, last_name, email, password) VALUES ('daniel', 'gunawan', 'dg@gmail.com', 'cat123');


