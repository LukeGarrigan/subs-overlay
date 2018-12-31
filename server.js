const express = require('express');
var app = express();
var server = app.listen(9999);


app.use(express.static('public'));




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
