const jwt = require('jsonwebtoken')
const { StudentModel } = require('../models/student')
const { UserModel } = require('../models/user')
const secret = process.env.JWT_SECRET

// This middleware check to see that the user has a valid JWT stored in their cookies
// and verify it, ensuring it is a non-expired token that was issued from this server.

// If they pass authentication it will check the decrypted payload for the current user's
// email which is stored there on creation, and find the matching student from the database
// pulling their information and sending it in response to the client.

const findStudentFromToken = function(req, res) {
    // The JWT is stored in the client's cookies, so find cookie called token sent
    // in the request headers
    const token = req.cookies.token

    if (!token) {
        // If no 'token' cookie  is found in the request headers send an Unauthorised HTTP response
        res.status(401).send('Unauthorized: No token provided') 
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if(err) {
                // If there is some error in the verification of the token e.g. the secret
                // used to encrypt the token was not the secret we use in generating tokens
                // it must be a dodgy token, so send an Unauthorised HTTP response
                res.status(401).send('Unauthorized: Invalid token')
            } else {
                // If the token is valid, check the user collection for an entry that has
                // an email that matches the decrypted token payload email
                UserModel.findOne({ email: decoded.email })
                    .then(user =>
                        // Check the student field of the matching user which contains the ObjectID
                        // of the student associated with that account, and find that student from
                        // the student collection
                        StudentModel.findOne({ _id: user.student })
                            // If that student is found, send it in response
                            .then(student => res.send(student))
                            // A catch in the event that a user is found, but the student
                            // associated with that user cannot be found
                            .catch(err => res.status(500).send("Student for this user cannot be found, please contact site administrators"))
                    )
                    // A catch in the event that a user who has the decoded email cannot be found
                    .catch(err => res.status(500).send("User cannot be found, please contact site administrators"))
            }
        })
    }
}

module.exports = findStudentFromToken
