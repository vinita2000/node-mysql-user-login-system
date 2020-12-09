const express = require('express');
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

//creating the new file for the sensitive info(passwords etc)
dotenv.config({ path: './.env' });

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//parsing the data send by the form
app.use(express.urlencoded({ extended: false }));
//parsing json
app.use(express.json());

//use cookies
app.use(cookieParser());

//for the page display using hbs
app.set('view engine', 'hbs');


db.connect((error)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("connected to the database");
    }
});

//pages are rendered from the routes/pages.js
app.use("/", require('./routes/pages'));
app.use("/auth", require('./routes/auth'));


app.listen(5000, ()=>{
    console.log('started server on port 5000');
});