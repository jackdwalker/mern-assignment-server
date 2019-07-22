const express = require('express')
const router = express.Router()
const { StudentModel } = require('../models/student')
const { UserModel } = require('../models/user')

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

module.exports = router
