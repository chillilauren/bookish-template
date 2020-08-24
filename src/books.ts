import knex from "knex";

const client = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        user: 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: 'librarydb'
    }
});

interface Book {
    author: string;
    title: string;
    genre: string;
}

// Get all books
export const fetchAllBooks = () => {
    return client
            .from("book")
            .select("title", "author", "id")
            .limit(10);
}

// Find book from search
export const findBook = (author:string, title:string) => {
    return client
            .select("*")
            .from("book")
            .where("title", "like", `%${title}%`)
            .andWhere("author", "like", `%${author}%`);
}

// Lookup book by ID
export const getBookById = (id:number) => {
    return client
            .select("*")
            .from("book")
            .where("id", id)
            .first();
    // return new Book ({id: id}).fetch;

}

// Edit book
export const editBook = (id:number, author:string, title:string, genre:string ) => {
    return client("book")
            .where("id", id)
            .update(
                {
                    author: author,
                    title: title,
                    genre: genre
                }
            );
}

// Add new book
export const addBook = (book : Book) => {
    return client
            .insert(
                {
                    author: book.author,
                    title: book.title,
                    genre: book.genre
                }
            )
            .into('book');
}

// Delete books
// const deleteBook = (id : number) => {
//     return client("book")
//             .delete()
//             .where("id", id);
// }

export const softDeleteBook = (id : number) => {
    return client("book")
            .where('id', id)
            .update('deleted', true)
}