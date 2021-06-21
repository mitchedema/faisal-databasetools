//This is to allow for HTTPS compliant if needed, uncomment code
//const fs = require('fs');
//const key = fs.readFileSync('./key.pem');
//const cert = fs.readFileSync('./cert.pem');

const express = require('express');
//const https = require('https');
const bodyParser = require('body-parser');
//const cors = require('cors');
const jsonParser = bodyParser.json()
const appRoutes = require('./app/routes/appRoutes.js');
const app = express();
const proxy = require('express-http-proxy');

//const server = https.createServer({key: key, cert: cert }, app);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/xnat', proxy('http://127.0.0.1:11111/'));
appRoutes(app, jsonParser);
// app.use(bodyParser.json({ type: 'application/*+json' }))
// app.use(bodyParser.urlencoded({ extended: true }));
const port = 4000;

app.listen(port, () => {
    console.log(`Faisal Database App listening at: http://localhost:${port}`)
});
