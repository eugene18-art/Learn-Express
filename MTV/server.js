require('app-module-path').addPath(__dirname);

const express=require('express');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const db=require('MTVProject/settings').get(process.env.NODE_ENV);

const app=express();
// app use
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(cookieParser());


// database connection
mongoose.Promise=global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(db.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, function(err) {
    if (err) console.log(err);
    else console.log("Database connected.");
});

// route
const project_urls =  require('MTVProject/urls');
app.use(project_urls);


//listening port
const PORT=process.env.PORT||8000;
app.listen(PORT, ()=>{
    console.log(`Development server started at http://127.0.0.1:${PORT}`);
});