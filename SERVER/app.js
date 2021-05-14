const express =  require('express'),
    app = express(),
    PORT = process.env.PORT || 3221,
    mongoose = require('mongoose'),
    passport = require('passport'),
    // {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
    path = require('path'),
    flash = require('connect-flash'),
    session = require('express-session'),
    upload = require('express-fileupload'),
    methodOverride = require('method-override'),
    bodyParser =  require('body-parser'),
    { mongodbURL } = require('./config/db');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);      
mongoose.connect(mongodbURL, {useNewUrlParser: true, useUnifiedTopology: true })
.then(db=>{
    console.log('database connected')
    })
.catch(err => console.log(`Errpr ${err}`))    

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(upload());
app.use(flash())
app.use(methodOverride('_method'))

// Session Middleware
app.use(session({
    secret: '00000',
    resave: true,
    saveUninitialized: true
}));

//Passport inits
app.use(passport.initialize());
app.use(passport.session());


// sETTing local variable for flash msgs
app.use( (req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.loggedUser = req.user 
    next();
})










// ROUTES
const log = require('./controller/home/log');
app.use('/logs', log)


const posts = require('./controller/account/post');
app.use('/posts', posts)


const users = require('./controller/account/users');
app.use('/users', users)


app.listen(PORT, ()=>{
    console.log(`Listening to port ${PORT}`)
})