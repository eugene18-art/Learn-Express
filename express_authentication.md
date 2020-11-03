_[source](https://medium.com/@sarthakmittal1461/to-build-login-sign-up-and-logout-restful-apis-with-node-js-using-jwt-authentication-f3d7287acca2)_

# Learn Express

## Steps
* ```mkdir Express_ForumApi && npm init```
* ```npm install -g nodemon```
* ```npm install express body-parser cookie-parser bcrypt mongoose jsonwebtoken```
    
    Use of each module is stated below:

    * express : Allows you to define routes of your application based on HTTP methods and URLs.
    * body-parser : It is used to handle HTTP post requests and extract the entire body portion of an incoming request stream and exposes it on req.body.
    * cookie-parser : It is used for parsing the cookies
    * bcrypt : It is used for hashing and comparing the passwords.
    * mongoose : It is used to connect to our MongoDB database.
    * jwtwebtoken : JSON Web Token (JWT) is an open standard that defines a compact and self-contained way of securely transmitting information between parties as a JSON object.
    * nodemon : It’s my favorite and it led to automatically restarting of our node application when any changes occur in our app.

* Install mongodb from [here](https://www.mongodb.com/try/download/community?tck=docs_server)