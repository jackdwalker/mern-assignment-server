const express = require('express')
const { UserModel } = require('../models/user')
const { StudentModel } = require('../models/student')
const { withAuth } = require('../middleware/withAuth')
const passport = require('passport')
const router = express.Router()

const {
    signJwtForUser,
    requireJwt,
    login,
    destroySession
} = require('../middleware/tokenCreation')

router.post('/register', (req, res) => {
    const newStudent = new StudentModel({
        name: req.body.name,
        avatarURL: req.body.avatarURL,
        techStack: req.body.techStack,
        websiteURL: req.body.websiteURL,
        twitterURL: req.body.twitterURL,
        githubURL: req.body.githubURL,
        graduated: req.body.graduated,
        hireable: req.body.hireable,
        location: req.body.location,
        fieldOfInterest: req.body.fieldOfInterest,
        seeking: req.body.seeking,
        bio: req.body.bio
    })

    const newUser = new UserModel ({
        email: req.body.email,
        password: req.body.password,
        student: newStudent._id
    })
    
    UserModel.register(newUser, req.body.password, err => {
        if (err) {
            res.status(500).send(err.message)
        }
        passport.authenticate('local')(req, res, () => {
            res.json(req.user)
        })
    })

    newStudent.save()

}, signJwtForUser)

router.post('/login', login, signJwtForUser)

router.get('/logout', destroySession)

module.exports = router
