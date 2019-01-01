const express = require('express');
const cors = require('cors');
var app = express();

app.use(cors());



app.use(express.static('public'));

var server = app.listen(9999);



//
// var socket = require('socket.io');

// var io = socket(server);

// io.sockets.on('connection', connectionMade)
//
// function connectionMade(socket) {
//
//   console.log("connection " + socket);
//
// }
