//express
const express = require("express")
const app = express();
const port = 3000;
// sequelize
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
host: 'localhost',
dialect: 'postgres'
});
// // handlebars
// const exphbs = require('express-handlebars')
// const hbs = exphbs.create({});

app.listen(port, () => {
    console.log(`App Listening to port ${port}`)
    client.query(`Select * from passwords`, (err, res) => {
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    client.end;
    });
});   

app.use(express.static('public'))

app.get("/passwords", (req, res) => {
    res.render('main', {layout: 'index'});
    client.query(`Select * from passwords`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
});

client.connect();

const login = require('../utils/login'); // Import login function (from login.js)
// OR
const PasswordController = require('../controllers/PasswordController'); // Import controller (from PasswordController.js)

// ... other application setup ...

// Start password management functionality
login(); // Call the login function (from login.js)
// OR
PasswordController.main(); // Call the main function from the controller (if using PasswordController.js)
