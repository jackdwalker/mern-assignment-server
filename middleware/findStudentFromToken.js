const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const findStudentFromToken = function(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        res.status(401).send('Unauthorized: No token provided') 
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                res.status(401).send('Unauthorized: Invalid token')
            } else {
                UserModel.findOne({ email: decoded.email })
                .then(user =>
                    StudentModel.findOne({ _id: user.student })
                        .then(student => res.send(student))
                        .catch(err => res.status(500).send(err.message))
                )
                .catch(err => res.status(500).send(err.message))
            }
        })
    }
}

module.exports = findStudentFromToken
