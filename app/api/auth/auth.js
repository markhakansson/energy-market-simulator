function auth(req, res, next) {
    if(req.session.user && req.session.cookie) {
        return next();
    }
    return res.redirect('/logout');
}
function isManager(req, res, next) {
    if(req.session.manager) {
        return next();
    }
    return res.redirect('/login');
}

function isLoggedIn(req, res, next) {
    if(req.session.user && req.session.cookie) {
        return res.redirect('/success');
    }
    return next();
}

module.exports = { auth, isManager, isLoggedIn };