const express = require("express")
const app = express();
const port = 3000;

const exphbs = require('express-handlebars')
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');
app.use(express.static('public'))

app.get("/", (req, res) => {
    res.render('main', {layout: 'index'});
});

app.listen(port, () => {
    console.log(`App Listening to port ${port}`)
});   

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
host: 'localhost',
dialect: 'postgres'
});