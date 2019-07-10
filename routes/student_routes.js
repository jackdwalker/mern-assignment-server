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

module.exports = router
