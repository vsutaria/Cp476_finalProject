const Bullet = require('./Bullet.js');
const Camera = require('./Camera.js');
const Gun = require('./Gun.js');
const GameMap = require('./Map.js');
const Player = require('./Player.js');
const RectangleComponent = require('./RectangleComponent.js');
const Wall = require('./Wall.js');

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

/*Player and Bullet Speeds*/
var sBullet = 3000;
var sPlayer = 200;

/*Canvas Width and Height*/
var cWidth = 900;
var cHeight = 800;

/*Player and Mouse Coordinates*/
var xPlayer = cWidth/2;
var yPlayer = cHeight/2;

var gameMap = new GameMap(mapWidth, mapHeight);
gameMap.generate();
var walls = gameMap.getWalls();

var bullets = [];

// Add the WebSocket handlers
var state = {};

io.on('connection', function(socket) {

  socket.on('new player', function() {
    console.log('new player connected: ' + socket.id);
    state[socket.id] = {
      player: new Player(xPlayer, yPlayer, sPlayer, rPlayer),
      gun: new Gun(xPlayer, yPlayer),
      camera: new Camera(0, 0, cWidth, cHeight, mapWidth, mapHeight)
    };
    state[socket.id].camera.follow(state[socket.id].player, cWidth/2, cHeight/2);
    io.to(socket.id).emit("new map", gameMap.getWalls());
  });

  socket.on('controls', function(data) {
    state[socket.id].player.update(step, mapWidth, mapHeight, walls, data);
    state[socket.id].gun.update(state[socket.id].player.xPos, state[socket.id].player.yPos, state[socket.id].camera.xPos, state[socket.id].camera.yPos, data);
    state[socket.id].camera.update();
  });

});

setTimeout(function(){ 
  setInterval(function() {
    io.sockets.emit('state', state);
  }, 1000 / 60);
}, 3000);