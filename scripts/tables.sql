CREATE DATABASE libraryDB;

CREATE TABLE book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    copies INT NOT NULL
);

CREATE TABLE bookCopy (
    id SERIAL PRIMARY KEY,
    book_id INT references book(id)
);

CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_no VARCHAR(255) NOT NULL
)

CREATE TABLE checkoutHistory (
    id INT references bookCopy(id),
    date_out DATETIME NOT NULL,
    date_back DATETIME NOT NULL,
    user INT references
)