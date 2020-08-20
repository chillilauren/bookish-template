import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import bodyParser from "body-parser";
import { fetchAllBooks, findBook, addBook, getBookById } from "./books";
import { addMember, findMember, getMemberById, editMember } from "./members";
import console from "console";

const app = express();
const port = process.env['PORT'] || 3000;

app.use(
    bodyParser.urlencoded({ extended: true })
)

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    }),
    express.static('public')
);

const PATH_TO_TEMPLATES = "./templates/";
nunjucks.configure(PATH_TO_TEMPLATES, {
    autoescape: true,
    express: app
});

// On hompage render index.html
app.get("/", async (req, res) => {
    const model = {
        list: await fetchAllBooks()
    }
    res.render('index.html', model);
});

// BOOKS

// Click books in nav to render search books page
app.get("/books", async (req, res) => {
    res.render('search_book.html');
});

// Add new book to database
app.get("/books/add", async (req, res) => {
    res.render('add_book.html');
});

app.post("/books/add", async (req, res) => {
    const book = req.body;
    await addBook(book);

    const model = {
        list: await findBook(book.author, book.title)
    }
    res.render("book_added.html", model);
});

// Search for book in database
app.get("/books/filter", async (req, res) => {
    const title = (req.query.title || "") as string;
    const author = (req.query.author || "") as string;

    const model = {
        list: await findBook(author, title)
    }
    res.render('search_book.html', model);
});

// Edit book
app.get("/books/:id/edit", async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await getBookById(id);

    console.log(id);
    res.render('edit-book.html', book)
})

// MEMBERS

// Click members in nav to render search members page
app.get("/members", async (req, res) => {
    res.render('search_member.html');
});

// Search for member in database
app.get("/members/filter", async (req, res) => {
    const fName = (req.query.f_name || "") as string;
    const lName = (req.query.l_name || "") as string;
    const email = (req.query.email || "") as string;
    const contactNo = (req.query.contact_no || "") as string;

    const model = {
        list: await findMember(fName, lName, email, contactNo)
    }
    
    res.render('search_member.html', model);
});

// Add new member to database
app.get("/members/add", async (req, res) => {
    res.render('add_member.html');
});

app.post("/members/add", async (req, res) => {
    const member = req.body;
    await addMember(member);

    const model = {
        list: await findMember(member.f_name, member.l_name, member.email, member.contact_no)
    }
    res.render("member_added.html", model);
});

// Edit member
app.get("/members/:id/edit", async (req, res) => {
    const id = parseInt(req.params.id);
    const member = await getMemberById(id);

    console.log(id);
    res.render('edit-member.html', member)
})

app.post("members/:id/edit", async (req, res) => {
    const member = req.body;
    console.log(member);

    // console.log("Hello")
    // const id = parseInt(req.params.id);
    // const memberID = await getMemberById(id);
    // console.log(id, member, memberID);

    // await editMember(memberID)

    // const model = {
    //     list: await findMember(member.f_name, member.l_name, member.email, member.contact_no)
    // }

    res.render('edit-member.html')
})

// Delete member





app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
