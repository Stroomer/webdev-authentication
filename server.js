if(process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

import dotenv from 'dotenv';
import express from 'express';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import bcrypt, { hash } from 'bcrypt';
import passport from 'passport';
import { initialize as initializePassport } from './passport-config.js';


initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const app = express();

const users = [];  // tijdeljke vervanging voor de database

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended:false }));
app.use(flash());
app.use(session({ 
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false 
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name:req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    console.log(users);
});

app.delete('/logout', (req, res, next) => {
    req.logout(function(err) {
        if(err) { return next(err); };
        res.redirect('/login');
      });
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}    

app.listen(3000);




/*

app.use(express.json());


app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', async (req, res) => {
    try {
        const salt           = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log(salt);
        console.log(hashedPassword);
        const user = { name:req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
    
    console.log(users);
    
    const user = users.find(user => user.name = req.body.name);
    if(user === null) {
        console.log('cannot find user');
        return res.status(400).send('Cannot find user');
    }
    try {
        console.log('yoyo');
        console.log(req.body.password);
        console.log(user.password);

        if(await bcrypt.compare(req.body.password, user.password)) {
            console.log('success');
            res.send('Success');       
        }else{
            console.log('not allowed');
            res.send('Not allowed');
        }
    } catch {
        console.log('500');
        res.status(500).send();
    }
});

*/





// https://youtu.be/Ud5xKCYQTjM?t=321