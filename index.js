require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({
    origin: '*'
}))

let port = 3300;

app.get('/', (req, res) => {
    res.send('Test');
    res.statusCode(200)
    res.statusMessage("Success")
})

app.listen(process.env.APP_PORT || port, () =>{
    console.log(`Server is running on port ${port}`);
})

module.exports = app;
