module.exports = {
        loggedIn: function(req, res, next){
        if (req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
        },
        
        adminCheck: function(req, res, next){
        if (req.isAuthenticated && req.users.isAdmin === true){
            next();}
        },
        ensureAdminRights: function(req, res, next) { 
        if(req.body.user.isAdmin && req.user.isAdmin === false) { 
            req.flash('error', 'Nice try ;)'); 
            return res.redirect('back'); 
            } 
            next(); 
        }
};