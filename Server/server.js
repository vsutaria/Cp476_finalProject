const Bullet = require('./Bullet.js').default;
const Camera = require('./Camera.js').default;
const Gun = require('./Gun.js').default;
const GameMap = require('./GameMap.js').default;
const Player = require('./Player.js').default;
const RectangeComponent = require('./RectangeComponent.js').default;
const Wall = require('./Wall.js').default;

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'game.html'));
});

// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

/*Frames Per Second (Refresh)*/
var fps = 60;
var interval = 1000/fps;
var step = interval/1000;

/*Player and Bullet Radius*/
var rPlayer = 40;
var rBullet = 10;

/*Initialize Game Map Size*/
var mapWidth = 2500;
var mapHeight = 2500;

/*Player and Mouse Coordinates*/
var xPlayer = canvas.width/2;
var yPlayer = canvas.height/2;

MyGame.rBullet = rBullet;

/*Plater and Bullet Speeds*/
var sBullet = 3000;
var sPlayer = 200;

// Add the WebSocket handlers
var state = {};

io.on('connection', function(socket) {

  socket.on('new player', function() {
    state[socket.id] = {
      player: new Player(),
      y: 300
    };
  });

  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });

});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);