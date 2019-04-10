// Objects
const Bullet = require('./Bullet.js');
const Camera = require('./Camera.js');
const Gun = require('./Gun.js');
const GameMap = require('./Map.js');
const Player = require('./Player.js');
const RectangleComponent = require('./RectangleComponent.js');
const Wall = require('./Wall.js');

// Dependencies
var express = require('express');
const http = require('http');
var path = require('path');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const socketIO = require('socket.io');

var bcrypt = require('bcrypt');


var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'pew_pew'
});
global.db= connection;


//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use("/", express.static(path.join(__dirname,'public')));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    secret: '080a26b6-c094-4ef3-a764-bba320177d4c',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/', httpOnly: true, maxAge: null
    }
}));


app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, './public', 'main.html'));
	//res.sendFile(path.join(__dirname+'main.html'));
})


//route the GET request to the specified path, "/user". 
//This sends the user information to the path  
app.post('/signUp', function (req,res){
	
	db.connect(function(err){
		if(!err) {
			console.log("Database is connected ... nn");    
		} else {
			console.log("Error connecting database ... nn");    
		}
	}); 
	
	
	
	var Fname = req.body.fname,
        Lname = req.body.lname,
        username = req.body.username,
		Email = req.body.email,
		password = req.body.psw,
		repeatP = req.body.rpsw,
		score = 0;
	
	
	
//	var newPass = bcrypt.hash(password, 10, function(err, hash) {
//		if (err) {
//     		throw err;
//  		}
		// Store hash in your password DB.
	//});
	
		var sql = "INSERT INTO `players`(FirstName,LastName,UserName, Password, Score,Email) VALUES ('" + Fname + "','" + Lname + "','" + username + "','" + password + "','" + score + "','" + Email+ "')";
 
		var query = db.query(sql, function(err, result) {
    		if (err) {
     		throw err;
  		}
		
			console.log("player added");
			res.redirect('/');
			//message = "Succesfully! Your account has been created.";
        	//res.render('signup.ejs',{message: message});
    	});
    
	
	
	db.end();
});

app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.psw;
	console.log(username);
	console.log(password);
	
	
	
	if (username && password) {
		db.connect(function(err){
			if(!err) {
				console.log("Database is connected ... nn");    
			} else {
				console.log("Error connecting database ... nn");    
			}
		}); 
		db.query('SELECT * FROM players WHERE UserName = ? AND Password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
		db.end();
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
	
}); 



var server = app.listen(5000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

var io = socketIO(server);

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
var colors = ["#0095DD","#FF3333","#4FFF33","#FF9933","#DD33FF","#FFE933"];

io.on('connection', function(socket) {

  socket.on('new player', function() {
    console.log('new player connected: ' + socket.id);
    state[socket.id] = {
      player: new Player(Math.floor(Math.random() * (2500 - rPlayer * 2)) + rPlayer, Math.random() * (2500 - rPlayer * 2) + rPlayer, sPlayer, rPlayer, colors[Object.keys(state).length%6]),
      gun: new Gun(xPlayer, yPlayer),
      camera: new Camera(0, 0, cWidth, cHeight, mapWidth, mapHeight),
      bulletList: bullets
    };
    state[socket.id].camera.follow(state[socket.id].player, cWidth/2, cHeight/2);
    io.to(socket.id).emit("new map", gameMap.getWalls());
  });

  socket.on('controls', function(data) {
    state[socket.id].player.update(step, mapWidth, mapHeight, walls, data);
    state[socket.id].gun.update(state[socket.id].player.xPos, state[socket.id].player.yPos, state[socket.id].camera.xPos, state[socket.id].camera.yPos, data);
    state[socket.id].camera.update();
    state[socket.id].bulletList = bullets;
    if(state[socket.id].player.health == 0){
      delete state[socket.id];
      socket.disconnect();
    }
  });

  socket.on('disconnect', function(){
    delete state[socket.id];
    socket.disconnect();
  });

  socket.on('fire', function(){
    var i;
    var pPos = state[socket.id].player.getPos();
    var angle = state[socket.id].gun.getAngle();

    xp = pPos[0] + state[socket.id].gun.getHeight() * Math.cos(angle + Math.PI/2); //Bullet xPos
    yp = pPos[1] + state[socket.id].gun.getHeight() * Math.sin(angle + Math.PI/2); //Bullet yPos

    xd = (xp - pPos[0])/cHeight;  //Bullet xDir
    yd = (yp - pPos[1])/cHeight;  //Bullet yDir

    bullets[bullets.length] = new Bullet(xp,yp,xd,yd,sBullet,rBullet);
  });
});

setInterval(function() {
  var dBullet = []; //Bullet indices to delete
  for(var i = 0; i < bullets.length; i++){
    bullets[i].update(step, gameMap.width, gameMap.height, gameMap.walls,state);
    if(!bullets[i].getSpawned()){
      dBullet[dBullet.length] = i;
    }
  }
  for(var i = 0; i < dBullet.length; i++){
    bullets.splice(dBullet[i] - i, 1);
  }
  io.sockets.emit('state', state);
}, 1000 / fps);