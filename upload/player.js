

module.exports = {
    addPlayer: (req, res) => {
        
        let message = '';
        var Fname = req.body.fname,
            lname = req.body.lname,
            username = req.body.username,
			Email = req.body.email,
			password = req.body.psw,
			repeatP = req.body.rpsw
            ;

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: Welcome to Socka | Add a new player
                });
            } else {
                
                        // send the player's details to the database
                        let query = "INSERT INTO `players` (first_name, last_name, position, number, image, user_name) VALUES ('" +
                            first_name + "', '" + last_name + "', '" + position + "', '" + number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                  
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: Welcome to Socka | Add a new player
                    });
                }
            }
        });
    }
//    editPlayerPage: (req, res) => {
//        let playerId = req.params.id;
//        let query = "SELECT * FROM `players` WHERE id = '" + playerId + "' ";
//        db.query(query, (err, result) => {
//            if (err) {
//                return res.status(500).send(err);
//            }
//            res.render('edit-player.ejs', {
//                title: Edit  Player
//                ,player: result[0]
//                ,message: ''
//            });
//        });
//    },
//    editPlayer: (req, res) => {
//        let playerId = req.params.id;
//        let first_name = req.body.first_name;
//        let last_name = req.body.last_name;
//        let position = req.body.position;
//        let number = req.body.number;

//        let query = "UPDATE `players` SET `first_name` = '" + first_name + "', `last_name` = '" + last_name + "', `position` = '" + position + "', `number` = '" + number + "' WHERE `players`.`id` = '" + playerId + "'";
//        db.query(query, (err, result) => {
//            if (err) {
//                return res.status(500).send(err);
//            }
//            res.redirect('/');
//        });
//    },
    
//};
