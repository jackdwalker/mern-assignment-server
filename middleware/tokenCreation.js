const passport = require('passport')
const PassportJwt = require('passport-jwt')
const JWT = require('jsonwebtoken')
const { UserModel } = require('../models/user')
const { StudentModel } = require('../models/student')

const algorithm = 'HS256'
const secret = 'goodsecret'

// Use the UserModel strategy (local-mongoose) for email and password
passport.use(UserModel.createStrategy())

// // Generate JWT for every request
// passport.use(new PassportJwt.Strategy({
//     // Telling Passport where the JWT will be in the request
//     jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: secret,
//     algorithms: [algorithm]
// }, async (payload, done) => { 
//         // We use done as this is a middleware, and it will tell app.js to move on to the next middleware
//         const user = await UserModel.findById(payload.sub)
//         if (user) {
//             // Copy token to user so Passport can find it
//             user.token = payload
//             done(null, user)
//         } else {
//             done('User not found', false)
//         }
//     }
// ))

// Generate a token on user login
const signJwtForLogin = (req, res) => {
    const token = JWT.sign(
        // Payload
        {
            sub: req.user._id.toString(),
            email: req.user.email
        },
        // Secret
        secret,
        // Config
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    res.cookie('token', token, { expires: new Date(Date.now() + 86400000), httpOnly: true })
    .status(200).send({ token: token });
}

// Generate a token on user signup
const signJwtForSignUp = (req, res, newUser) => {
    const token = JWT.sign(
        // Payload
        {
            sub: newUser._id,
            email: newUser.email
        },
        // Secret
        secret,
        // Config
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    res.cookie('token', token, { expires: new Date(Date.now() + 86400000), httpOnly: true })
    .status(200).send({ token: token })
}

// Generate an already expired token as a way of destroying session

const destroySession = (req, res) => {
    const token = JWT.sign(
        // Payload
        {},
        // Secret
        secret,
        // Config
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    res.cookie('token', token, { expires: new Date(Date.now() - 86400000), httpOnly: true })
    .status(200).send('Successful logout');
}

module.exports = {
    signJwtForLogin,
    signJwtForSignUp,
    destroySession,
    initializePassport: passport.initialize(),
    // Login through Passport without a session
    login: passport.authenticate('local', { session: false }),
    // requireJwt: passport.authenticate('jwt', { session: false })
}
