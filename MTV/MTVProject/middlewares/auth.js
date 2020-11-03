const {User} = require('forum_app/models');

let auth = (request, response, next) => {
    let token = request.cookies.auth;
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return response.status(401).json({
            error:true
        });

        request.token = token;
        request.user = user;
        next();
    });
}

module.exports={auth};