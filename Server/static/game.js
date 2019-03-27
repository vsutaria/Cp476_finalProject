var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

var controls = {
  kW: false,
  kA: false,
  kS: false,
  kD: false,
  xMouse: 0,
  yMouse: 0
}

var bullets = [];

document.addEventListener("keydown", kDownHandler, false);
document.addEventListener("keyup", kUpHandler, false);

function kDownHandler(e) {
    if(e.key == "w" || e.key == "W") {
        MyGame.controls.kW = true;
    }
    if(e.key == "a" || e.key == "A") {
        MyGame.controls.kA = true;
    }
    if(e.key == "s" || e.key == "S") {
        MyGame.controls.kS = true;
    }
    if(e.key == "d" || e.key == "D") {
        MyGame.controls.kD = true;
    }
}

function kUpHandler(e) {
    if(e.key == "w" || e.key == "W") {
        MyGame.controls.kW = false;
    }
    else if(e.key == "a" || e.key == "A") {
        MyGame.controls.kA = false;
    }
    else if(e.key == "s" || e.key == "S") {
        MyGame.controls.kS = false;
    }
    else if(e.key == "d" || e.key == "D") {
        MyGame.controls.kD = false;
    }
}

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
});