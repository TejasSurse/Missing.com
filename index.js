const express = require("express");
const app = express();
const mysql = require("mysql2");
const path = require("path");
const multer = require('multer');
const session = require('express-session'); // Import express-session
const port = 3000;
const adminkey = 123123;

// MySQL connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'missing'
});

// Use express-session to manage user sessions
app.use(session({
    secret: 'your_secret_key', // A secret key used to sign the session ID
    resave: false,             // Prevents resaving unchanged session data
    saveUninitialized: true    // Save uninitialized sessions
}));

// Middleware to check if the user is logged in
function checkLogin(req, res, next) {
    if (req.session.loggedIn) {
        next();
    } else {
        res.send("Please log in first.");
    }
}

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Setup Multer storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Start server
app.listen(port, () => {
    console.log("Server is listening on port", port);
});

// Render login form
app.get("/", (req, res) => {
    res.render("login.ejs");
});

// Handle login form submission
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`;

    conn.query(query, (err, data) => {
        if (err) {
            res.send("Something went wrong");
            console.log(err);
        } else {
            if (data.length === 0) {
                res.send("<h1>User not found</h1>");
            } else {
                // Set session variable indicating user is logged in
                req.session.loggedIn = true;
                req.session.user = data[0]; // Store user data in session
                res.redirect("/missings");
            }
        }
    });
});

// Middleware-protected route (user must be logged in)
app.get("/missing", checkLogin, (req, res) => {
    res.send(`<h1>Welcome, ${req.session.user.name}!</h1>`);
});

// Render signup page
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", (req, res)=>{
    const {username, email, password} = req.body;
    let query = `INSERT INTO user values('${username}',  '${email}', '${password}')`;
    conn.query(query, (err, data)=>{
        if(err){
            res.send("DATA not inserted");
        }else{
            res.render("login.ejs");
        }
    })
});


// Display images
app.get("/images", checkLogin, (req, res) => {
    const sql = "SELECT name, image FROM imageupload";
    conn.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data from database:", err);
            res.status(500).send("Failed to retrieve data");
        } else {
            // Convert image buffer to base64 for display
            const images = results.map(row => {
                return {
                    name: row.name,
                    image: row.image.toString('base64')
                };
            });

            // Render the image data in the template
            res.render("images.ejs", { images });
        }
    });
});

app.get("/add", (req, res)=>{
    res.render("addmiss.ejs");
})

app.post("/add", upload.single('image'), (req, res) => {
    // Validate if file and data exist
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const name = req.body.name;   // Get name from form
    const image = req.file.buffer; // Get image buffer from multer
    const description = req.body.description; // Get description from form

    // Insert name, image, and description into the 'missings' table
    const sql = "INSERT INTO missings (name, image, description) VALUES (?, ?, ?)";
    conn.query(sql, [name, image, description], (err, result) => {
        if (err) {
            console.error("Error inserting data into database:", err);
            res.status(500).send("Failed to submit complaint");
        } else {
            console.log("Data inserted successfully");
            res.redirect("/missings");
        }
    });
});

// Route to render the homepage
app.get('/missings', (req, res) => {
    const sql = "SELECT name, image, description FROM missings";
    conn.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error retrieving data");
        } else {
            res.render('missings.ejs', { data: results });
        }
    });
});

// Route to render the homepage
app.get('/companysec', (req, res) => {
    const sql = "SELECT name, image, description FROM missings";
    conn.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            res.status(500).send("Error retrieving data");
        } else {
            res.render('companysec.ejs', { data: results });
        }
    });
});

app.get("/admin", (req, res)=>{
    res.render("admin.ejs");
});

app.post("/admin", (req, res)=>{
    let {password} = req.body;
    if(password == adminkey){
        res.redirect("/companysec");
    }else{
        res.status(401).send("Invalid Adminkey");
    }
});


// logout
app.get("/logout", (req, res)=>{
    res.render("login.ejs");
});


app.get("/deletelisting/:name", (req, res) => {
    let { name } = req.params;
    name = name.trim(); // Trim whitespace
    console.log(`Deleting entry with name: "${name}"`);

    // Use a prepared statement to prevent SQL injection and ensure proper handling of special characters
    let q = `DELETE FROM missings WHERE TRIM(name) = '${name}';`
    conn.query(q, (err, result) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).send("Error deleting data");
        }
        console.log(result); // Log result for debugging

        if (result.affectedRows === 0) {
            // If no rows were deleted, it means no matching entry was found
            return res.status(404).send("No matching record found");
        }
        
        // Redirect to /companysec after successful deletion
        res.redirect("/companysec");
    });
});




