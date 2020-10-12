const http = require('http');
const express = require('express');
const localConfig = require('./config/local.json');
const path = require('path');

const app = express();

const server = http.createServer(app);
const port = process.env.PORT || localConfig.port;


require('./routers/index')(app,server);

console.log(`Starting server on port ${port}`)
server.listen(port, function(){
  console.log(`backend listening on http://localhost:${port}`);
});

app.use(function (req, res, next) {
  res.header('Content-Type', 'application/json');
  next();
});

app.use(function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '404.html'));
});

app.use(function (err, req, res, next) {
    res.sendFile(path.join(__dirname, '../public', '500.html'));
});

