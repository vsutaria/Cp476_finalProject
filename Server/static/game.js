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

document.addEventListener("keydown", kDownHandler, false);
document.addEventListener("keyup", kUpHandler, false);

function kDownHandler(e) {
    if(e.key == "w" || e.key == "W") {
        controls.kW = true;
    }
    if(e.key == "a" || e.key == "A") {
        controls.kA = true;
    }
    if(e.key == "s" || e.key == "S") {
        controls.kS = true;
    }
    if(e.key == "d" || e.key == "D") {
        controls.kD = true;
    }
}

function kUpHandler(e) {
    if(e.key == "w" || e.key == "W") {
        controls.kW = false;
    }
    else if(e.key == "a" || e.key == "A") {
        controls.kA = false;
    }
    else if(e.key == "s" || e.key == "S") {
        controls.kS = false;
    }
    else if(e.key == "d" || e.key == "D") {
        controls.kD = false;
    }
}

socket.emit('new player');
setInterval(function() {
  socket.emit('controls', controls);
}, 1000 / 60);

var canvas = document.getElementById('myCanvas');
canvas.width = 900;
canvas.height = 800;
var ctx = canvas.getContext('2d');

canvas.addEventListener("mousemove", aimHandler, false);

function aimHandler(e){
  var c = e.target.getBoundingClientRect();
  controls.xMouse = Math.floor(e.clientX - c.left);
  controls.yMouse = Math.floor(e.clientY - c.top);
}

socket.on('state', function(state) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state[socket.id].draw(ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);

  for (var id in state) {
    state[id].player.draw(ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
    state[id].gun.draw(ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
  }
});