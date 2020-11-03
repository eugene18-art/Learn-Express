const {User} = require('../models');
function register(request, response) {
    // taking a user
    const newuser = new User(request.body);

    if (newuser.password!=newuser.confirm_password) 
        return response.status(400).json({
            message: "Password did not match."
        });
    
    User.findOne({email:newuser.email}, function(err, user) {
        if (user) 
            return response.status(400).json({
                auth:false, 
                message: "email exists"
            });
        
        newuser.save((err, doc)=> {
            if(err) {
                return response.status(400).json({success:false});
            }
            response.status(201).json({
                success:true,
                user:doc
            });
        });
    });
}

function login(request, response) {
    let token = request.cookies.auth;
    User.findByToken(token, (err, user) => {
        if(err) return response(err);
        if(user) 
            return response.status(400).json({
                error: true,
                message: "You are already logged in"
            });
        else {
            User.findOne({'email':request.body.email}, function(err, user) {
                if (!user) 
                    return response.status(400).json({
                        isAuth: false, message: 'Auth Failed, email not found.'
                });
                user.comparepassword(request.body.password, (err, isMatch)=>{
                    if(!isMatch) 
                        return response.status(400).json({
                            isAuth: false, 
                            message: "Password doesn't match."
                        });
                    user.generateToken((err, user)=>{
                        if(err) return response.status(400).send(err);
                        response.cookie('auth', user.token).json({
                            isAuth: true,
                            id: user._id,
                            email: user.email
                        });
                    });
                });
            });
        }
    });
}

function profile(request, response) {
    response.json({
        isAuth: true,
        id: request.user._id,
        email: request.user.email,
        name: request.user.firstname + request.user.lastname
    });
}

function logout(request, response) {
    request.user.deleteToken(request.token, (err, user)=>{
        if(err) 
            return response.status(400).send(err);
        response.sendStatus(200);
    });
}

module.exports = {register, login, profile, logout}