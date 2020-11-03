const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const db=require('./config/config').get(process.env.NODE_ENV);

const User = require('./models/user');
const {auth} = require('./middlewares/auth');

const app=express();
// app use
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookieParser());


// database connection
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) console.log(err);
    else console.log("Database connected.");
});

// ========= route ============
//  user register
app.post('/api/register/', function(request, response) {
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
                console.log(err);
                return response.status(400).json({success:false});
            }
            response.status(201).json({
                success:true,
                user:doc
            });
        });
    });
});
// user login
app.post('/api/login/', function(request, response) {
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
});
// get logged in user
app.get('/api/profile/', auth, function(request, response) {
    response.json({
        isAuth: true,
        id: request.user._id,
        email: request.user.email,
        name: request.user.firstname + request.user.lastname
    });
});
// logout user
app.get('/api/logout/', auth, function(request, response) {
    request.user.deleteToken(request.token, (err, user)=>{
        if(err) 
            return response.status(400).send(err);
        response.sendStatus(200);
    });
});
app.get("/", function(request, response) {
    response.status(200).send("welcome to login, sign-up api");
});

//listening port
const PORT=process.env.PORT||8000;
app.listen(PORT, ()=>{
    console.log(`Development server started at http://127.0.0.1:${PORT}`);
});