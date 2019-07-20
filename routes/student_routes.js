const express = require('express')
const router = express.Router()
const { StudentModel } = require('../models/student')
const { UserModel } = require('../models/user')

router.get('/', (req, res) => {
    StudentModel.find()
        .then(students => res.send(students))
        .catch(error => res.status(500).send({
            error: error.message
        }))
})

router.post('/', (req, res) => {
    let newStudent = new StudentModel({
        name: req.body.name,
        email: req.body.email
    })

    newStudent.save(function(err) {
        if (err) return console.log(err.message)
    })

    res.sendStatus(200)
})

router.get('/all-students', (req, res) => {
    StudentModel.find().limit(50)
        .then((students) => {
            res.send(students)
        })
        .catch(err => res.status(500).send =({
            error: err.message
        }))
})

module.exports = router
