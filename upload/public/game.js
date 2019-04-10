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
var img = null;

canvas.addEventListener("mousemove", aimHandler, false);
canvas.addEventListener("click", function(e){
    socket.emit("fire");
  }, false);

function aimHandler(e){
  var c = e.target.getBoundingClientRect();
  controls.xMouse = Math.floor(e.clientX - c.left);
  controls.yMouse = Math.floor(e.clientY - c.top);
}

function drawMap(c, xPos, yPos){
  var sx, sy, dx, dy;
  var sWidth, sHeight, dWidth, dHeight;

  sx = xPos;
  sy = yPos;

  sWidth = c.canvas.width;
  sHeight = c.canvas.height;

  if(img.width - sx < sWidth){
    sWidth = img.width - sx;
  }
  if(img.height - sy < sHeight){
    sHeight = img.height - sy;
  }

  dx = 0;
  dy = 0;
  dWidth = sWidth;
  dHeight = sHeight;

  c.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
}

function drawPlayer(p, c, xCvs, yCvs){
  c.save();
  c.beginPath();
  c.arc(p.xPos - xCvs, p.yPos - yCvs, p.radius, 0, Math.PI*2);
  c.fillStyle = p.col;
  c.fill();
  c.strokeStyle = "#000000"
  c.stroke();
  c.closePath();
  c.restore();
}

function drawHealth(p, c, xCvs, yCvs){
  c.save();
  c.beginPath();
  c.rect(p.xPos - p.health/2 - xCvs, p.yPos - p.radius - 20 - yCvs, p.health, 10);
  c.fillStyle = "#FF0000";
  c.fill();
  c.closePath();
  c.restore();
}

function drawGun(g, c, xCvs, yCvs){
  c.save();
  c.translate(g.xPos - xCvs, g.yPos - yCvs);
  c.rotate(g.angle);

  c.beginPath();
  c.rect(-g.width/2, 0, g.width, g.height);
  c.fillStyle = "#873600";
  c.fill();
  c.strokeStyle = "#000000"
  c.stroke();
  c.closePath();

  c.restore();
}

function drawBullet(g, ctx, xCvs, yCvs){
  ctx.save();
  ctx.beginPath();
  ctx.arc(g.xPos - xCvs, g.yPos - yCvs, g.radius, 0, Math.PI*2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}

socket.on('new map', function(walls) {
  var h = 2500;
  var w = 2500;

  var c = document.createElement("canvas").getContext("2d");
    c.canvas.width = w;
    c.canvas.height = h;

    // var imgBg = new Image();
    // imgBg.src = "images/background.png"; /*https://www.toptal.com/designers/subtlepatterns/vintage-concrete*/


    var rows = ~~(w/200) + 1;
    var cols = ~~(h/200) + 1;

    c.save();     
    c.fillStyle = "#00A102";       
    for (var x = 0, i = 0; i < rows; x+=200, i++) {
      c.beginPath();      
      for (var y = 0, j = 0; j < cols; y += 200, j++) {            
        c.rect (x, y, 200, 200);        
      }
      c.fillStyle = "#00A102";
      c.fill();
      c.strokeStyle = "#009002";
      c.stroke();
      c.closePath();      
    }   
    c.restore();

    var WALLS = {
      WIDTH: 20,
      LENGTH: 300,
      DOOR: 100
    }

    /*Array of house coords for floors*/
    var houses = [300,1900];

    /*Houses' Walls - https://www.color-hex.com/color-palette/74708*/
    wallColor = "#977b5f";
    floorColor = "#816346";

    for(var i = 0; i < houses.length; i++){
      for(var j = 0; j < houses.length; j++){
        c.save();     
        c.beginPath();          
        c.rect (houses[i], houses[j], WALLS.LENGTH + WALLS.WIDTH, WALLS.LENGTH + WALLS.WIDTH);        
        c.fillStyle = floorColor;
        c.fill();
        c.closePath();
        c.restore();
      }
    }

    for (var i = 0; i < walls.length; i++) {
      c.save();
      c.beginPath();              
      c.rect (walls[i].xStart, walls[i].yStart, walls[i].width, walls[i].height);
      c.fillStyle = walls[i].color;
      c.fill();
      c.strokeStyle = "#000000";
      c.stroke();
      c.closePath();
      c.restore();
    }

    img = new Image();
    img.src = c.canvas.toDataURL("image/png");

    c = null;
});

setTimeout(function(){ 
  socket.on('state', function(state) {
    console.log(state);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap(ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);

    for (var id in state) {
      drawPlayer(state[id].player, ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
      drawGun(state[id].gun, ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
      drawHealth(state[id].player, ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
    }
    for (var i = 0; i < state[id].bulletList.length; i++) {
      drawBullet(state[id].bulletList[i], ctx, state[socket.id].camera.xPos, state[socket.id].camera.yPos);
    }
    console.log('drawn');
  });
}, 1000);