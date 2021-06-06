const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json')
const route = require('./route');
const app = express();

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 10000 }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use('/app/route',route);

app.listen(config.PORT, ()=> {
    console.log(`application is running on port : ${config.PORT}`)
});