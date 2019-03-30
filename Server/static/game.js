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
}, 1000 / 1);

var canvas = document.getElementById('myCanvas');
canvas.width = 900;
canvas.height = 800;
var ctx = canvas.getContext('2d');
var map = null;
var img = new Image();

canvas.addEventListener("mousemove", aimHandler, false);

function aimHandler(e){
  var c = e.target.getBoundingClientRect();
  controls.xMouse = Math.floor(e.clientX - c.left);
  controls.yMouse = Math.floor(e.clientY - c.top);
}

function drawMap(ctx, xPos, yPos){
  var sx, sy, dx, dy;
  var sWidth, sHeight, dWidth, dHeight;

  sx = xPos;
  sy = yPos;

  sWidth = ctx.canvas.width;
  sHeight = ctx.canvas.height;

  if(map.width - sx < sWidth){
    sWidth = map.width - sx;
  }
  if(map.height - sy < sHeight){
    sHeight = map.height - sy;
  }

  dx = 0;
  dy = 0;
  dWidth = sWidth;
  dHeight = sHeight;

  ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function drawPlayer(p, ctx, xCvs, yCvs){
  ctx.save();
  ctx.beginPath();
  ctx.arc(p.xPos - xCvs, p.yPos - yCvs, p.radius, 0, Math.PI*2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.strokeStyle = "#000000"
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function drawGun(g, ctx, xCvs, yCvs){
  ctx.save();
  ctx.translate(g.xPos - xCvs, g.yPos - yCvs);
  ctx.rotate(g.angle);

  ctx.beginPath();
  ctx.rect(-g.width/2, 0, g.width, g.height);
  ctx.fillStyle = "#873600";
  ctx.fill();
  ctx.strokeStyle = "#000000"
  ctx.stroke();
  ctx.closePath();

  ctx.restore();
}

socket.on('new map', function(m) {
  /*map = m;*/
  img.src = m;
});

socket.on('state', function(state) {
  console.log(state);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.log('drew rect');

  drawMap(ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);

  console.log('drew map');
  for (var id in state) {
    drawPlayer(state[id].player, ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
    drawGun(state[id].gun, ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
  }
  console.log('drawn');
});