CREATE TABLE IF NOT EXISTS librarydb. book (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NULL,
);

ALTER TABLE book ADD UNIQUE (title,author);
ALTER TABLE book DROP COLUMN copies;

CREATE TABLE IF NOT EXISTS librarydb. bookCopy (
    id SERIAL PRIMARY KEY,
    book_id INT references book(id)
);

CREATE TABLE IF NOT EXISTS librarydb. member (
    id SERIAL PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_no VARCHAR(255) NOT NULL
);

ALTER TABLE member ADD UNIQUE (email);

CREATE TABLE IF NOT EXISTS librarydb. checkoutHistory (
    id SERIAL PRIMARY KEY,
    copy_id INT references bookCopy(id),
    date_out DATE NOT NULL,
    date_back DATE NOT NULL,
    member_id INT references member(id)
);