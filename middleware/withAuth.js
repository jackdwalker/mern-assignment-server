const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const withAuth = function(req, res, next) {
    const token = req.cookies.token


    if (!token) {
        res.status(401).send('Unauthorized: No token provided') 
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if(err || decoded.student_id != req.body._id) {
                res.status(401).send('Unauthorized: Invalid token')
            } else {
                next()
            }
        })
    }
}

module.exports = withAuth
