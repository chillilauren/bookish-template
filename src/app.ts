import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import bodyParser from "body-parser";
import { fetchAllBooks, findBook, addBook, getBookById, editBook, softDeleteBook } from "./books";
import { findMember, getMemberById, editMember, addMember, fetchMemberByEmail } from "./members";
import console from "console";
import passport from "passport";
import { hashPassword } from "./security";

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

// On hompage render index.html and list all books
app.get("/", async (req, res) => {
    const books =  {
        list: await fetchAllBooks()
    };
    res.render('index.html', books);
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

    res.render('edit-book.html', book)
})

app.post("/books/:id/edit", async (req, res) => {
    const id = parseInt(req.params.id);
    const book = req.body;
    // console.log(book);

    await editBook(id, book.author, book.title, book.genre);
    const model = {
        list: await findBook(book.author, book.title)
    }

    res.render('book_saved.html', model);
})

// Delete book
// app.get("/books/:id/delete", async (req, res) => {
//     const id = parseInt(req.params.id);
//     const book = await getBookById(id);

//     console.log("hello", book);
    
//     // const confirmDelete = confirm(`Are you sure you want to delete ${book.title} by ${book.author}?`)
//     // if (confirmDelete) {
//     //     softDeleteBook();
//     // }
//     // res.render('edit-book.html', book)
// })

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

// configure express to use Passport
app.use(passport.initialize());

// passport.use(new passportLocal.Strategy(
//     {
//         usernameField: "email",
//         passwordField: "password",
//     },
//     async (email, password, done) => {
//         const member = await tryLoginMember(email, password);
//         if (member) {
//             return done(null, member);
//         }
//         return done(null, false, {message: "Email or password is incorect"})
//     }
// ));

// Register member
app.get("/register", async (req, res) => {
    res.render('register.html')
})

app.post("/register", async (req, res) => {
    console.log(req.body);
    
    const registerMember = {
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        email: req.body.email,
        contact_no: req.body.contact_no,
        password: req.body.password
    }
    console.log(registerMember);
    
    // check password match if not return error
    // call add member with
    try {
        if (registerMember.password != req.body.rpt_password) {
            throw "The passwords do not match.";
        } else {
            console.log("Passwords match");
            await addMember(registerMember);

            const model = {
                list: await findMember(registerMember.f_name, registerMember.l_name, registerMember.email, registerMember.contact_no)
            }
            res.render("member_added.html", model);
        }
    }
    catch (err) {
        console.log(err);
        // alert(err);
    }
});

// Login

app.get("/login", async (req, res) => {
    res.render('login.html')
})

app.post("/login", async (req, res) => {
    // look up email
    const memberEmail = req.body.email;
    const member = await fetchMemberByEmail(memberEmail);

    console.log(member);
    
    // hash password entered
    const enteredPwdHash = hashPassword(req.body.password);

    console.log(enteredPwdHash, member.password);
    // does hash password === hash of provided password
    try {
        if (enteredPwdHash != member.hashed_pwd) {
            throw "The passwords do not match.";
        } else {
            console.log("Passwords match.");
            console.log(`Welcome ${member.f_name}.`)

            res.render("member_logged_in.html", member);
        }
    }
    catch (err) {
        console.log(err);
        // alert(err);
    }
})



// Edit member
app.get("/members/:id/edit", async (req, res) => {
    const id = parseInt(req.params.id);
    const member = await getMemberById(id);

    // console.log(id);
    res.render('edit-member.html', member)
})

app.post("/members/:id/edit", async (req, res) => {
    const id = parseInt(req.params.id);
    const member = req.body;
    // console.log(member);

    await editMember(id, member.f_name, member.l_name, member.email, member.contact_no);
    const model = {
        list: await findMember(member.f_name, member.l_name, member.email, member.contact_no)
    }

    res.render('member_saved.html', model);
})

// Delete member


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});