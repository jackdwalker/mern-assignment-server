const express = require('express')
const { UserModel } = require('../models/user')
const passport = require('passport')
const router = express.Router()

const {
    signJwtForUser,
    login
} = require('../middleware/tokenCreation')

router.post('/register', (req, res) => {
    const newUser = new UserModel({
        email: req.body.email,
        role: 'student'
    })
    
    UserModel.register(newUser, req.body.password, err => {
        if (err) {
            res.status(500).send(err.message)
        }
        passport.authenticate('local')(req, res, () => {
            res.json(req.user)
        })
    })
}, signJwtForUser)

router.post('/login', login, signJwtForUser)

router.get('/logout', (req, res) => {
    req.logout()
    res.sendStatus(200)
})

module.exports = router




