const express = require('express')
const router = express.Router()
const { StudentModel } = require('../models/student')
const { UserModel } = require('../models/user')
const withAuth = require('../middleware/withAuth')
const findStudentFromToken = require('../middleware/findStudentFromToken')

router.get('/all-students', (req, res) => {
    StudentModel.find().limit(50)
        .then(students => {
            res.send(students)
        })
        .catch(err => res.status(500).send =({
            error: err.message
        }))
})

router.get('/profile/:id', (req, res) => {
    StudentModel.findById(req.params.id)
        .then(student => {
            UserModel.findOne({student: req.params.id})
                .then(user => {
                    const newStudent = {...student['_doc'], email: user['email']}
                    res.send(newStudent)
                })
        })
        .catch(err => res.status(500).send =({
            error: err.message
        }))
})

router.get('/edit-profile/', findStudentFromToken)

router.post('/update-profile', withAuth, function(req, res) {
    StudentModel.findOneAndUpdate(
        {
            _id: req.body._id
        }, 
        {
            name: req.body.name,
            avatarURL: req.body.avatarURL,
            techStack: req.body.techStack,
            websiteURL: req.body.websiteURL,
            linkedInURL: req.body.linkedInURL,
            twitterURL: req.body.twitterURL,
            githubURL: req.body.githubURL,
            hireable: req.body.hireable,
            location: req.body.location,
            fieldOfInterest: req.body.fieldOfInterest,
            seeking: req.body.seeking,
            bio: req.body.bio
        })
        .then(result => {
            res.sendStatus(200)
        })
        .catch(err => {
            res.status(500).send(err)
        })
})

router.post('/delete-profile', withAuth, function(req, res) {
    StudentModel.findOneAndDelete({
        _id: req.body._id
    })
    .then(result => {
        UserModel.findOneAndDelete({
            student: req.body._id
        })
        .then(result => {
            res.sendStatus(200) 
        })
        .catch(err => {
           res.status(500).send(err)
        })
    })
    .then(result => {
        res.sendStatus(200) 
    })
    .catch(err => {
       res.status(500).send(err)
    })
})

module.exports = router
