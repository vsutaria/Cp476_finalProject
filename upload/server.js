var express = require('express');
var path = require('path');
var app = express();
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

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
		
		var sql = "INSERT INTO `players`(FirstName,LastName,UserName, Password, Score,Email) VALUES ('" + Fname + "','" + Lname + "','" + username + "','" +hash + "','" + score + "','" + Email+ "')";
 
		var query = db.query(sql, function(err, result) {
    		if (err) {
     		throw err;
  		}
		
			console.log("player added");
			res.send({ data: 'user created in db' });
			//message = "Succesfully! Your account has been created.";
        	//res.render('signup.ejs',{message: message});
    	});
    // Store hash in your password DB.
	//});
	
	
	
	db.end();
});

app.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
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
		db.query('SELECT * FROM accounts WHERE UserName = ? AND Password = ?', [username, password], function(error, results, fields) {
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