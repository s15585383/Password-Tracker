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