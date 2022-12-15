
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // store the url thet are requesting
        req.session.returnTo = req.originalUrl; 
        req.flash('error', 'Please sign in!');
        return res.redirect('/login');
    }
    next();
}


module.exports.isAdmin = async (req,res,next) => {
    const user = req.user;
    const type = user.usertype;

    if ( type != 'admin') {
        req.flash('error', 'You have no permission to this operation');
        return res.redirect('home');
    }
    
    next();
}
