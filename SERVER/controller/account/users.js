
const express = require('express'),
     app = express(),
     router = express.Router(),
     User =  require('../../model/User'),
     faker =  require('faker'),
     bcrypt = require('bcryptjs'),
     Post =  require('../../model/Post'),
     requireLogin = require('../../helpers/require-login');




router.get('/*', (req, res, next)=>{
    res.app.locals = 'user'
    next();
})     



router.get('/all', (req, res)=>{
    User.find()
    .select("-password")
    .then(users=>{
        res.json({users})
    })
    .catch(err=>console.log(err))
})


router.get('/all/limit', (req, res)=>{
    User.find()
    .limit(7)
    .select("-password")
    .then(users=>{
        res.json({users})
    })
    .catch(err=>console.log(err))
})


router.post('/dummy', requireLogin, (req, res)=>{
    console.log('seen.....')
    for(let i = 0; i < req.body.number; i++){
        let newUser = new User()
        newUser.name = faker.lorem.word()
        newUser.email = faker.lorem.word() + '@gmail.com'
        
        bcrypt.genSalt(10, (err, salt)=>{
            if(err)console.log(err)
            bcrypt.hash('12345', salt, (err, hash)=>{
                if(err)console.log(err)
                newUser.password = hash
                newUser.save()
                .then(response=>{
                    res.json(response)
                })
                .catch(err=>console.log(err))
             })
        })
    }
})


router.post('/follow/:id', requireLogin, (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        user.followers.push(req.user._id)
        user.save()
        .then(response=>{
            Post.find({user: req.params.id})
            .then(posts=>{
                User.findOne({_id: req.user._id})
                .then(loggedUser=>{
                    loggedUser.following.push(req.params.id)
                    loggedUser.save()
                    .then(response=>{
                        res.json({posts, user})       
                    })
                })
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.post('/unfollow/:id', requireLogin, (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        user.followers.pull(req.user._id)
        user.save()
        .then(response=>{
            Post.find({user: req.params.id})
            .then(posts=>{
                User.findOne({_id: req.user._id})
                .then(loggedUser=>{
                    loggedUser.following.pull(req.params.id)
                    loggedUser.save()
                    .then(response=>{
                        res.json({posts, user})
                    })
                })
                
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})


router.put('/edit/:id', (req,res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        if(!req.body.password){
          
            if(!req.body.name){
                user.name =  user.name
            }else{
                user.name =  req.body.name
            }

            if(!req.body.email){
                user.email =  user.email
            }else{
                user.email =  req.body.email
            }
            
            user.save()
            .then(response=>{
                Post.find({user: req.params.id})
                .then(posts=>{
                    res.json({posts, user})
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        }else{
            user.name =  req.body.name
            user.email =  req.body.email
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err=>console.log(err))
                    user.password = hash
                    user.save()
                    .then(response=>{
                        Post.find({user: req.params.id})
                        .then(posts=>{
                            res.json({posts, user})
                        })
                        .catch(err=>console.log(err))
                    })
                    .catch(err=>console.log(err))
                })
            })
        }
    })
    .catch(err=>console.log(err))
})



router.delete('/delete/:id', (req, res)=>{
    User.findOne({_id: req.params.id})
    .then(user=>{
        user.delete()
        .then(response=>{
            console.log(response)
            res.status(200).json({success: "Deleted"})
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})





router.post('/search', (req,res)=>{
    let name = req.body.search
    let regex = new RegExp(name, 'i')

    User.find({$or: [{name: regex}] })
    .then(users=>{
        if(!users){
            res.status(402).json({error: "No User Found!"})
        }
        if(users.length > 1){
            res.json({users})
        }else{
            User.findOne({$or: [{name: regex}]})
            .then(user=>{
                Post.find({user})
                .then(posts=>{
                    res.json({posts,user})
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        }
    })
    .catch(err=>console.log(err))
})





module.exports = router;