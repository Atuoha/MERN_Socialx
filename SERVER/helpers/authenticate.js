 module.exports = {

    auth: function(req, res, next){
        if(req.isAuthenticated){
            return next()
        }else{
            res.redirect('/signin')
        }
    }
 }