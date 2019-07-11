const express = require('express')
const router = express.Router()
const { StudentModel } = require('../models/student')

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


module.exports = router
