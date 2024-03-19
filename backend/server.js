const client = require('./connection.js')
const express = require('express')

const cors = require("cors");

require('dotenv').config()
const {Sequelize} = require('sequelize')

const app = express()
const port = 4000

const bodyparser = require('body-parser')
app.use(bodyparser.json())

// app.use(cors());
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const sequelize = new Sequelize(process.env.DB_URL,{
    dialect:'sqlite',
    storage:'./database.sqlite',
    logging: false,

})

sequelize.sync().then(() => {console.log('Database connected');}).catch(err => {console.log(err.message);})

// client.connect();

app.get('/users', (req,res) => {
    client.query('select * from users', (err,result) => {
        if(!err) res.status(201).json(result.rows)
        else res.status(401).json({message: err.message})
    })
    client.end;
})

app.post('/users',(req,res) => {
    const user = req.body

    const now = new Date();

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = days[now.getDay()];
    const dateOfMonth = now.getDate();
    const monthOfYear = months[now.getMonth()];

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const currentTime = `${dayOfWeek} ${monthOfYear} ${dateOfMonth} ${now.getFullYear()} ${hours}:${minutes}:${seconds}`;
    // console.log(req.body);
    // console.log(currentTime);

    // const codeWithEscapedNewlines = user.code.replace(/\n/g, '\\n');
    const insertQuery = 'INSERT INTO users (username, language, code, time) VALUES ($1, $2, $3, $4)';
    const values = [user.name, user.language, user.code, currentTime];

    client.query(insertQuery,values, (err,result) => {
        if(!err) res.status(201).json({message: 'Insert was successful'})
        else res.status(401).json({message: err.message})
    })
    client.end;
})

app.listen(port, () => {
    console.log('Server running on port '+port);
})