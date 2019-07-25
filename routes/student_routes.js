const express = require('express')
const router = express.Router()
const { StudentModel } = require('../models/student')
const { UserModel } = require('../models/user')
const withAuth = require('../middleware/withAuth')
const findStudentFromToken = require('../middleware/findStudentFromToken')
const { deleteSession } = require('../middleware/tokenCreation')
const secret = process.env.JWT_SECRET
const algorithm = 'HS256'

// The API route to collect the first 50 registered students information.
// As we do not have pagination set-up/specified as part of our MVP,
// we decided to limit the amount of viewable profiles to 50, or anyone
// could mass create user profiles, and attempting to render browse profiles
// component could take an extremely long time to load/crash the front-end.
router.get('/all-students', (req, res) => {
    // Finding students with no set parameters will return all students,
    // and then limiting the results returned to 50 collection entries.
    StudentModel.find().limit(50)
        // If no errors occur, send these students back in response
        .then(students => {
            res.send(students)
        })
        // If an error occurs send a Server Error HTTP response, and
        // the error message.
        .catch(err => res.status(500).send =({
            error: err.message
        }))
})

// The API route to acquire the student collection information for the student
// with the ObjectID that matches that of the request id parameter.
router.get('/profile/:id', (req, res) => {
    // Find the student whose ObjectID matches the req.params.id
    StudentModel.findById(req.params.id)
        .then(student => {
            // Find the user collection entry whose student key value is 
            // referenced by this req.params.id ObjectID
            UserModel.findOne({student: req.params.id})
                .then(user => {
                    // Create a new object which contains the student returned by 
                    // the StudentModel query above, and add the email key/value pair
                    // associated with the user found in the UserModel query above.

                    // Note: the student argument passed into the .then callback
                    // following the StudentModel query for some reason when used in
                    // this instance contains the whole promise. The '_doc' key of the 
                    // promise contains the actual collection entry data, so we are spreading
                    // only what is in that key i.e. throwing out the rest of the promise.
                    const newStudent = {...student['_doc'], email: user['email']}

                    // Sending back the newStudent in response to this API request
                    res.send(newStudent)
                })
        })
        // If an error occurs send a Server Error HTTP response, and
        // the error message. 
        .catch(err => res.status(500).send =({
            error: err.message
        }))
})

// The API route that is called upon a user attempting to edit their profile
// on the front-end. It will find the DB collection data of the user editing 
// their profile and return it so it can populate the fields on edit page,
// so a user won't have to re-enter any information e.g. retype their entire
// bio just to fix a small typo they made on sign-up.
// This process is handled by the findStudentFromToken middleware. See that file's
// comments for a more technical breakdown of how this works.
router.get('/edit-profile/', findStudentFromToken)

// The API route that will handle the actual updating of a user's information
// on submission of the edit profile form on the front-end. Uses the withAuth
// middleware to check for an authenticated user. See withAuth.js for more
// information on this process.
router.post('/update-profile', withAuth, function(req, res) {
    StudentModel.findOneAndUpdate(
        // Find the student's whose ObjectID matches the _id passed in the request body.
        {
            _id: req.body._id
        }, 
        // Update the entries values to those passed through in the request body.
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
        // On success send an OK HTTP response
        .then(result => {
            res.sendStatus(200)
        })
        // If an error occurs send a Server Error HTTP response, and
        // the error message. 
        .catch(err => {
            res.status(500).send(err)
        })
})

// The API route that handles a user requesting to delete their profile. Will
// find the associated user and student collection entries and remove them.
// Uses the withAuth middleware to check for an authenticated user. 
// See withAuth.js for more information on this process.
router.post('/delete-profile', withAuth, function(req, res) {
    // Find the student collection entry that matches the _id passed in the
    // request body and remove it
    StudentModel.findOneAndDelete({
        _id: req.body._id
    })
    .then(result => {
        // Find the user collection entry whose student key value is the
        // _id passed in the request body and remove it also
        UserModel.findOneAndDelete({
            student: req.body._id
        })
            // On success send an destroy the session of the user deleting 
            // their account
            .then(result => {
                deleteSession(req, res, secret, algorithm)
            })
            // If an error occurs send a Server Error HTTP response, and
            // the error message.
            .catch(err => {
            res.status(500).send(err)
            })
    })
    // If an error occurs send a Server Error HTTP response, and
    // the error message.
    .catch(err => {
       res.status(500).send(err)
    })
})

module.exports = router
