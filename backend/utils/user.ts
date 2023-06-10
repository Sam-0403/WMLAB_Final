const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var user = require("../model/user.js");

function login(req, res) {
    try {
        if (req.body && req.body.username && req.body.password) {
            user.find({ username: req.body.username }, (err, data) => {
                if (data.length > 0) {
                    console.log(data[0]._id)
                    if (bcrypt.compareSync(data[0].password, req.body.password)) {
                        checkUserAndGenerateToken(data[0], req, res);
                    } else {

                        res.status(400).json({
                            errorMessage: 'Username or password is incorrect!',
                            status: false
                        });
                    }

                } else {
                    res.status(400).json({
                        errorMessage: 'Username or password is incorrect!',
                        status: false
                    });
                }
            })
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

function findUser(req, res) {
    try {
        if (req.body && req.body.username) {
            user.find({ username: req.body.username }, (err, data) => {
                    if (data.length > 0) {
                        console.log(data[0]._id)
                        res.json({
                            message: 'Find User Successfully.',
                            user: data[0],
                            status: true
                        });
                    } else {
                        console.log('Username is incorrect!')
                        res.status(400).json({
                            errorMessage: 'Username is incorrect!',
                            status: false
                        });
                    }
                }
            )
        }
    }
    catch(err) {
        console.log(err)
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
}

function registerUser(username, password, userId, res) {
    var result = user.find({ username: username }, (err, data) => {
        if (data.length == 0) {
            let User = new user({
                username: username,
                password: password,
                userId: userId,
            });
            User.save((err, data) => {
                if (err) {
                    return {
                        isError: true, 
                        message: err
                    }
                }
            });
            console.log(typeof(User))
            console.log(User)
            // return {
            //     isError: false, 
            //     message: User.toString(),
            // }
            res.status(200).json({
                status: true,
                user: User
            });
            return

        } else {
            return {
                isError: true, 
                message: `UserName ${username} Already Exist!`
            }
        }

    });
    return result
}

/* register api */
function register(req, res) {
    try {
        if (req.body && req.body.username && req.body.password) {
            registerUser(req.body.username, req.body.password, req.body.userId, res).then((result) => {
                if(result.isError){
                    res.status(400).json({
                        errorMessage: result.message,
                        status: false
                    });
                }
                // else{
                //     console.log("Success")
                //     console.log(result)
                //     res.status(200).json({
                //         status: true,
                //         user: result.message
                //     });
                // }
            })
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

function checkUserAndGenerateToken(data, req, res) {
    jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
        if (err) {
            res.status(400).json({
                status: false,
                errorMessage: err,
            });
        } else {
            res.json({
                message: 'Login Successfully.',
                token: token,
                user: data,
                status: true
            });
        }
    });
}

export { login, register, checkUserAndGenerateToken, registerUser, findUser }
