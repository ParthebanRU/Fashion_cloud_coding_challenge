require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

const appRoute = require('./src/routes/cache-app.route');
const { default: mongoose } = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({
    origin: '*'
}))

let port = 3300;
const apiVersion = process.env.API_VERSION_0 

app.get('/', (req, res) => {
    res.status(200).send('Test');
})

app.use(`/api/${apiVersion}/cache`, appRoute)

let dbUrl = process.env.DB_URL || "mongodb://localhost:27017/cache-app";
mongoose.connect(dbUrl, {useNewUrlParser: true});

mongoose.Promise = global.Promise;

mongoose.connection.on('error', console.error.bind(console, "MongoDB Connection Error"));

app.listen(process.env.APP_PORT || port, () =>{
    console.log(`Server is running on port ${port}`);
})

module.exports = app;
