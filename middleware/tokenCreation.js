const passport = require('passport')
const JWT = require('jsonwebtoken')
const { UserModel } = require('../models/user')

const algorithm = 'HS256' // Setting the JWT encryption algorithm (HMAC SHA-256)
const secret = process.env.JWT_SECRET // Designating the location of the secret used for JWT encryption

// Use the UserModel strategy (local-mongoose) for email and password authentication
passport.use(UserModel.createStrategy())

// Generate JWT and sending it to the client as a cookie on login
const signJwtForLogin = (req, res) => {
    // Declaring a token variable which will be a JWT
    const token = JWT.sign(
        // Payload - the encrypted contents that will be readable upon verification/decryption
        {
            // req.user is an object provided upon authentication by Passport. As local auth
            // happens prior to this middleware being called. This function requires local auth
            // to have happened to be able to generate a token.
            sub: req.user._id.toString(),
            email: req.user.email,
            student_id: req.user.student
        },
        // Secret - a secret phrase/string that will be used to encrypt the token
        secret,
        // Config - defining the expiring date of this JWT and the algorithm used for encryption
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    // Sending the newly generated JWT in response as a cookie, calling it 'token' this is the name
    // the cookie will be stored as in the browser. This cookie will expire from the browser in 
    // 24 hours from the date it was sent (86400000 seconds). Setting httpOnly to true means that
    // Javascript cannot be used to modify the cookie, making it secure against Cross-Site Scripting
    // Attacks
    res.cookie('token', token, { expires: new Date(Date.now() + 86400000), httpOnly: true })
    .status(200).send({ token: token });
}

// Generate JWT and sending it to the client as a cookie on sign-up
const signJwtForSignUp = (req, res, newUser) => {
    // Declaring a token variable which will be a JWT
    const token = JWT.sign(
        // Payload - the encrypted contents that will be readable upon verification/decryption
        {
            // newUser here will be the newly created UserModel entry defined within the sign-up
            // POST request from the client
            sub: newUser._id,
            email: newUser.email,
            student_id: newUser.student
        },
        // Secret - a secret phrase/string that will be used to encrypt the token
        secret,
        // Config - defining the expiring date of this JWT and the algorithm used for encryption        
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    // Sending the newly generated JWT in response as a cookie, calling it 'token' this is the name
    // the cookie will be stored as in the browser. This cookie will expire from the browser in 
    // 24 hours from the date it was sent (86400000 seconds). Setting httpOnly to true means that
    // Javascript cannot be used to modify the cookie, making it secure against Cross-Site Scripting
    // Attacks
    res.cookie('token', token, { expires: new Date(Date.now() + 86400000), httpOnly: true })
    .status(200).send({ token: token })
}

// Generate an already expired token as a way of destroying session

const destroySession = (req, res) => {
    const token = JWT.sign(
        // Payload - the encrypted contents that will be readable upon verification/decryption
        // The payload is empty as this token will be sent having already expired, so it won't
        // ever actually exist in the browser.
        {},
        // Secret - a secret phrase/string that will be used to encrypt the token
        secret,
        // Config - defining the expiring date of this JWT and the algorithm used for encryption
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    // Sending the newly generated JWT in response as a cookie, calling it 'token' this is the name
    // the cookie will be stored as in the browser. This cookie will expire from the browser in 
    // immediately upon hitting the browser, as the expiry day is set to a time before Date.now(). 
    // This will work for any amount of time before now (86400000 here is arbitrary). Setting httpOnly 
    // to true means that Javascript cannot be used to modify the cookie, in the event it is intercepted 
    // before it hits the browser, where a malicious actor could change the expiry date and have a valid token.
    res.cookie('token', token, { expires: new Date(Date.now() - 86400000), httpOnly: true })
    .status(200).send('Successful logout');
}


// Same as the destroySession method, but takes additional params as is needed to properly call the function
// rather than use it directly as a middleware
const deleteSession = (req, res, secret, algorithm) => {
    const token = JWT.sign(
        // The payload is empty as this token will be sent having already expired, so it won't
        // ever actually exist in the browser.
        {},
        // Secret - a secret phrase/string that will be used to encrypt the token
        secret,
        // Config - defining the expiring date of this JWT and the algorithm used for encryption
        {
            algorithm,
            expiresIn: '24h'
        }
    )
    // Sending the newly generated JWT in response as a cookie, calling it 'token' this is the name
    // the cookie will be stored as in the browser. This cookie will expire from the browser in 
    // immediately upon hitting the browser, as the expiry day is set to a time before Date.now(). 
    // This will work for any amount of time before now (86400000 here is arbitrary). Setting httpOnly 
    // to true means that Javascript cannot be used to modify the cookie, in the event it is intercepted 
    // before it hits the browser, where a malicious actor could change the expiry date and have a valid token.
    res.cookie('token', token, { expires: new Date(Date.now() - 86400000), httpOnly: true })
    .status(200).send('Successful logout');
}

module.exports = {
    signJwtForLogin,
    signJwtForSignUp,
    destroySession,
    deleteSession,
    initializePassport: passport.initialize(),
    // Login through Passport without a session, we don't need a session
    // as the cookie acts as a placeholder for the session
    login: passport.authenticate('local', { session: false }),
}
