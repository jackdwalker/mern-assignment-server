const express = require('express')
const { UserModel } = require('../models/user')
const { StudentModel } = require('../models/student')
const passport = require('passport')
const router = express.Router()
const md5 = require('js-md5')

// Calling in all of the necessary authentication and cookie
// generating functions from the tokenCreation middleware
const {
    signJwtForLogin,
    signJwtForSignUp,
    login,
    destroySession
} = require('../middleware/tokenCreation')

// The API route to generate a new User and Student
router.post('/register', (req, res) => {
    // A newStudent needs to be defined in a variable so that it's
    // key/value pairs can be accessed elsewhere in this function
    // i.e. so that the ObjectID can be stored as a reference inside
    // of the newUser defined below
    const newStudent = new StudentModel({
        // The values for each field should be in the body of the request
        // being made to this API route, if they are not, the default
        // values will be used
        name: req.body.name,
        techStack: req.body.techStack,
        websiteURL: req.body.websiteURL,
        linkedInURL: req.body.linkedInURL,
        twitterURL: req.body.twitterURL,
        githubURL: req.body.githubURL,
        location: req.body.location,
        fieldOfInterest: req.body.fieldOfInterest,
        seeking: req.body.seeking,
        bio: req.body.bio,
        // The MD5 module will generate an MD5 hash of the email used
        // to sign up. This is what the Gravatar component will use on the
        // front-end to retrieve the Gravatar associated with this email.
        // This means the email will never need to be exposed in the state
        // on the front-end.
        gravatar: md5(req.body.email)
    })
    // Saving this newStudent to the database
    newStudent.save()

    // Creating a User Model collection entry. This also needs to be stored
    // in a variable as Passport requires it as a parameter of it's register
    // function
    const newUser = new UserModel ({
        email: req.body.email,
        password: req.body.password,
        // Referencing the newStudent's ObjectID, creating the link between
        // the two database entries
        student: newStudent._id
    })
    
    // Passport's register function. Will generate and store a password hash 
    // from the password handed over in the request body, never storing the 
    // password anywhere in cleartext.
    UserModel.register(newUser, req.body.password, err => {
        if (err) {
            res.status(500).send(err.message)
        }
        // If no errors occur in the registration process, authenticate this 
        // user
        passport.authenticate('local', { session: false })(req, res, () => {
             // Signs a JWT for the new user, sending them the token as a cookie in
            // response to a successful sign-up. This middleware must be called inside
            // of this callback to have access to the newUser variable. Using it as
            // a regular middleware would put the newUser variable out of scope.
            signJwtForSignUp(req, res, newUser)
        })
    })
       

   
    
})

// The API route to login, authenticating the credentials sent in the request
// and generating a JWT on successful authentication.
router.post('/login', login, signJwtForLogin)

// The API route to logout, sending the client an expired cookie, removing their
// ability to access any routes requiring JWT verification.
router.get('/logout', destroySession)

module.exports = router
