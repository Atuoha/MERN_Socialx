const express = require('express'),
    app = express(),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth20').Strategy;
    LocalStrategy = require('passport-local').Strategy
    router = express.Router(),
    crypto = require('crypto'),
    clientSecret = process.env.CLIENTSECRET,
    clientId = process.env.CLIENTSECRET,
    bcrypt = require('bcryptjs'),
    User = require('../../model/User'),
    jwt = require('jsonwebtoken'),
    // nodemailer = require('nodemailer'),
    // sendgridTransport = require('nodemailer-sendgrid-transport'),
    { JWT_SECRET } = require('../../config/jwt');
    

// const transport = nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key: ''
// }))

router.get('/*', (req, res, next)=>{
    req.app.locals = '';
    next()
})    



router.get('/signin', (req, res)=>{
    res.render('home/siginin');
})



router.get('/signup', (req, res)=>{
    res.render('home/signup');
})



router.post('/signup', (req, res)=>{

   if(!req.body.email || !req.body.name || !req.body.password){
       return res.status(422).json({error:'Fields must not be empty'})
   }else{
    User.findOne({email: req.body.email})
    .then(user=>{
        if(user){
            return res.status(422).json({error: 'Email already exists'}) 
        }else{
            const newUser = new User();
            newUser.email =  req.body.email;
            newUser.name = req.body.name;
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err)console.log(err)
                    newUser.password = hash;

                    if(req.body.file){
                        newUser.file = req.body.file
                    }
                    newUser.save()
                    .then(response=>{
                        // transport.sendMail({
                        //     to: user.email,
                        //     from: "help@app.com",
                        //     subject: "Welcome to App!",
                        //     html: "<p>Welcome to App. We are happy to have you here buddy</p>"
                        // })
                        // .then(res=>console.log('sent mail'))
                        // .catch(err=>console.log(err))
                        return res.status(200).json({message: 'Created account successfully'})
                    })
                    .catch(err=>console.log(err))
                })
            })

        }
    })
    .catch(err=>console.log(err))
   }


})





// router.post('/signin', (req, res)=>{
//     if(!req.body.email || !req.body.password){
//         return res.status(422).json({error: "Fields can not be empty"})
//     }
//     User.findOne({email: req.body.email})
//     .then(user=>{
//         if(!user){
//            return res.status(422).json({error: "Email not recognised"})
//         }

//         bcrypt.compare(req.body.password, user.password, (err, matched)=>{
//             if(!matched){
//                 return res.status(422).json({error: "Password mismatch"})
//             }else{
//                 const token = jwt.sign({_id: user._id}, JWT_SECRET)
//                 const loggeduser = {
//                     id: user.id,
//                     name: user.name,
//                     email: user.email
//                 }
//                 req.user = user
//                 console.log(user)
//                 res.json({token, loggeduser})
//             }
//         })
//     })
// })



// implementing passport for sign in
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    if(!email || !password){
        console.log('Fields Can not be empty')
        // return done(null, false, {error: 'Fields Empty!'})
    }
    User.findOne({email: email})
    .then(user=>{
        if(!user){
            // return res.json({error: "Email not recognised"})
            console.log('Email Not Recognised')
        }else{
            bcrypt.compare(password, user.password, (err, matched)=>{
                if(err)console.log(err);

                if(!matched){
                    // return res.status(422).json({error: "Password Mismatch"})
                    console.log('Password Mismatch')
                }else{
                    console.log(`logged in as ${user.email}`)
                    return done(null, user)
                }
            })
        }
    })
    .catch(err=>console.log(err))
}))



passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});



router.post('/signin', passport.authenticate('local', {
        // successRedirect: '/admin',
        // failureRedirect: '/logs/signin',
        failureFlash: true
}),(req, res)=>{
   
    User.findOne({email: req.body.email})
    .then(user=>{
        // if(!user){
        //     res.json({error: "Error"})
        //     console.log('error')
        // }
        const token = jwt.sign({_id: user._id}, JWT_SECRET)
        const loggeduser = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        req.user = user
        console.log(user)
        res.json({token, loggeduser})
    })
    .catch(err=>console.log(err))
})

// passport.use(new GoogleStrategy({
//     clientID: clientId,
//     clientSecret: clientSecret,
//     callbackURL: '/auth/google/callback'
// }, (accessToken)=>{
//     console.log(accessToken)
// }))


// router.get('/auth/google', passport.authenticate('google',{
//     scope:['profile', 'email']
// }))




router.post('/forgot-password', (req, res)=>{
    crypto.randomBytes(20, (err, buffer)=>{
        if(err)console.log(err)

        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user=>{
            if(!user){
                res.status(404).json({error: "Unrecognised email address"})
            }else{
                user.reset_token = token
                user.token_expires = Date.now() + 360000
                user.save()
                .then(response=>{
                    // transport.sendMail({
                    //     to: user.email,
                    //     from: "help@app.com",
                    //     subject: "Welcome to App!",
                    //     html: `<p>Welcome to App. We are happy to have you here buddy. Click on this <a href="http://localhost:7837/reset/${token}">link</a> to reset now</p>`
                    // })
                    // .then(res=>console.log('sent mail'))
                    // .catch(err=>console.log(err))
                    console.log(`http://localhost:7837/reset/${token}`)
                    res.json({success: 'Reset Link Sent, check your mail!'})
                })
                .catch(err=>{
                    res.json({error: 'Opps! Something went wrong'})
                })
            }
            
        })
    })
})




router.post('/reset-password', (req, res)=>{
    console.log('.......receiving..........')
    User.findOne({reset_token: req.body.token, token_expires:{$gt: Date.now()}})
    .then(user=>{
        if(user){
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err)console.log(err)
                    user.password = hash
                    user.save()
                    .then(response=>{
                        res.status(200).json({success: "Password reset successfully :) "})
                        console.log('Resetted')
                    })
                    .catch(err=>{
                        res.status(404).json({error: err})
                    })
                })
            })
        }else{
            res.status(404).json({error: "Opps! Link expired or invalid"})
        }
    })
})


router.get('/token/:token', (req, res)=>{
    User.findOne({reset_token: req.params.token, token_expires:{$gt: Date.now()}})
    .then(user=>{
        if(!user){
            res.status(404).json({error: "Invalid Token"})
        }

        res.status(202).json({success: user.email})
    })
    .catch(err=>console.log(err))
})


router.get('/signout', (req, res)=>{
    req.logout();
    res.redirect('/')
})

module.exports = router;