const {Client} = require('pg');

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "newDB",
    password: "ruffghanor",
    port: 5432,
});
module.exports = client
client.connect();

client.query(`Select * from passwords`, (err, res) => {
    if(!err){
        console.log(res.rows);
    } else {
        console.log(err.message)
    }
    client.end;
});
