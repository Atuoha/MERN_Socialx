const express = require('express'),
    app =  express(),
    router = express.Router(),
    fs =  require('fs'),
    faker = require('faker'),
    { isEmpty } = require('../../helpers/upload-helpers'),
    Post = require('../../model/Post'),
    User = require('../../model/User'),
    requireLogin =  require('../../helpers/require-login');

router.get('/*', (req, res, next)=>{
    req.app.locals =  'post'
    next()
})


router.get('/', (req, res)=>{
    Post.find()
    .populate('user')
    .sort('-createdAt')
    .then(posts=>{
        // res.render('admin/posts', {posts})
        res.json({posts})
    })
    .catch(err=>console.log(err))
})



router.get('/following_posts', (req, res)=>{
    console.log('following_posts..........')
    Post.find({user: {$in: req.user.following}})
    .populate('user')
    .sort('-createdAt')
    .then(posts=>{
        // res.render('admin/posts', {posts})
        res.json({posts})
        console.log(`FollowPosts: ${posts}`)
    })
    .catch(err=>console.log(err))
})


router.get('/my-posts', requireLogin, (req, res)=>{
    console.log(`My Posts: ${req.user}`)
    Post.find({user: req.user._id})
    .populate('user')
    .sort('-createdAt')
    .then(posts=>{
        // res.render('admin/my-posts', {posts})
        User.findOne({_id: req.user._id})
        .then(user=>{
            res.json({posts, user})
        })
        
    })
    .catch(err=>console.log(err))
})


router.get('/user-posts/:user', (req, res)=>{
    console.log(`Posts: ${req.params.user}`)
    Post.find({user: req.params.user})
    .populate('user')
    .sort('-createdAt')
    .then(posts=>{
        // res.render('admin/my-posts', {posts})
        User.findOne({_id: req.params.user})
        .then(user=>{
            res.json({posts,user})
        })
        .catch(err=>console.log(err))
        
    })
    .catch(err=>console.log(err))
})


router.get('/create', (req, res)=>{
    res.render('admin/posts/create');
})

router.get('/dummy', (req, res)=>{
    res.render('admin/posts/dummy');
})

router.post('/create', requireLogin, (req, res)=>{
    const {title, content, file} = req.body

    if(!title || !content || !file){
        return res.status(422).json({error: "Fields must not be empty"})
    }

    Post.findOne({title: req.body.title})
    .populate('user')
    .then(post=>{
        if(post){
            // req.flash('error_msg', 'Post already exists!');
            // res.redirect('back');
            return res.status(422).json({error: "Post already exists!"})
        }

        // let filename = ''
        // if(!isEmpty(req.files)){
        //     const file = req.files.file
        //     filename = `${Date.now()} - ${file.name}`
        //     uploadDir = './public/uploads/'
        //     file.mv(uploadDir + filename, err=>{
        //         if(err)console.log(err)
        //     })
        // }

            
        

        const newPost =  new Post();
        newPost.title = req.body.title
        newPost.content = req.body.content
        // newPost.file = filename
        newPost.file = req.body.file
        newPost.user = req.user.id
        newPost.save()
        .then(response=>{
            // req.flash('success_msg', `${response.title} has been published`);
            // res.redirect('/posts');
            return res.status(200).json({success: `${response.title} has been published`})
        })
        .catch(err=>console.log(err))
    })
})


router.post('/dummy/generate', (req, res)=>{
    if(!req.body.number){
        res.status(401).json({error: "Input can not be emptpy"})
    }
    for(let i = 0; i < req.body.number; i++){
        let newPost = new Post()
        newPost.title = faker.lorem.word()+ '' + faker.random.word()
        newPost.content = faker.lorem.sentence();
        newPost.file = 'default.png';
        newPost.user = req.user
        newPost.save()
        .then(response=>{
           res.status(200).json({success: `${req.body.number} dummies has been generated `})
        })
        .catch(err=>console.log(err))
    }
})


router.get('/show/:id', (req, res)=>{
    Post.findOne({_id: req.params.id})
    .populate('user')
    .then(post=>{
        // res.render('admin/show', {post})
        console.log(post)
        res.json({post})

    })
    .catch(err=>console.log(err))
})


router.put('/like', requireLogin, (req, res)=>{
    Post.findOne({_id: req.body.postId})
    .populate('user')
    .then(post=>{
        post.likes.push(req.user._id);
        post.save()
        .then(response=>{
            res.json(response);
            console.log(response)
        })
        .catch(err=>{
            res.status(422).json({error: "Error occured"});
            console.log(err)
        })
    })
})





router.put('/unlike', requireLogin, (req, res)=>{

    Post.findOne({_id: req.body.postId})
    .populate('user')
    .then(post=>{
        post.likes.pull(req.user._id);
        post.save()
        .then(response=>{
            res.json(response);
            console.log(response)
        })
        .catch(err=>{
            res.status(422).json({error: "Error occured"});
            console.log(err)
        })
    })    

})




router.post('/comment/:id', requireLogin, (req, res)=>{
    Post.findOne({_id: req.params.id})
    .populate('user')
    .then(post=>{
        const comment_data = {
            text: req.body.comment_msg,
            name: req.user.name, 
            user: req.user._id
        }

        post.comments.push(comment_data)
        post.save()
        .then(response=>{
            res.json(response)
            console.log(response)
        })
        .catch(err=>{
            res.status(422).json({error: "Error occured"});
            console.log(err)
        })
    })

})




router.get('/edit/:id', (req, res)=>{
    Post.findOne({id: req.params.id})
    .populate('user')
    .then(post=>{
        res.render('admin/edit', {post})
    })
    .catch(err=>console.log(err))
})





router.put('/update/:id', requireLogin, (req, res)=>{
    Post.findOne({_id: req.params.id})
    .then(post=>{
        // let filename = post.file
        // if(!isEmpty(req.files)){
        //     file = req.files.file
        //     filename = `${Date.now()} - ${file.name}`
        //     let uploadDir =  './public/uploads/'
        //     file.mv(uploadDir + filename, err=>{
        //         if(err)console.log(err)
        //     })

        //     if(post.file !== 'default.png'){
        //         let delDir = './public/uploads/'
        //         fs.unlink(delDir + post.file, err=>{
        //             if(err)console.log(err)
        //         })
        //     }
        // }

        post.title = req.body.title
        post.content = req.body.content
        post.file =  req.body.file
        post.save()
        .then(response=>{
            res.json(response)
            console.log(response)
        })

        .catch(err=>{
            res.status(422).json({error: "Error occured"});
            console.log(err)
        })
    })
})


router.delete('/delete/:id', requireLogin, (req, res)=>{
    Post.findOne({_id: req.params.id})
    .then(post=>{
        // if(post.file !== 'default.png'){
        //     let delDir = './public/uploads/'
        //     fs.unlink(delDir + post.file, err=>{
        //         if(err)console.log(err)
        //     })
        // }
        post.delete()
        .then(response=>{
            console.log(response)
           res.status(200).json({success: "Post Deleted"})
        })
        .catch(err=>{
            console.log(err)
            res.status(200).json({success: err})
        })
    })
    .catch(err=>console.log(err))
})



router.post('/search', (req, res)=>{
    let title = req.body.search
    let regex = new RegExp(title, 'i')

    Post.find({$or: [{title: regex}]})
    .populate('user')
    .then(posts=>{
        if(!posts){
            res.status(402).json({error: "No Post with title"})
        }

        if(posts.length > 1){
            res.json({posts})
        }else{
            Post.findOne({$or: [{title: regex}]})
            .populate('user')
            .then(post=>{
                res.json({post})
            })
            .catch(err=>console.log(err))
        }
    })
    .catch(err=>console.log(err))
})



module.exports = router;