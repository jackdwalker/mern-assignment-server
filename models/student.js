const mongoose = require('mongoose')

// Declaring the Schema variable as a new mongoose Schema
const Schema = mongoose.Schema

// Defining the format for a Student database collection entry
const StudentSchema = new Schema ({
    // The student's name
    name: {
        type: String,
        required: true
    },
    // The set of skills a student feels they are competent in
    techStack: {
        type: Array,
        default: []
    },
    // The personal website URL of the student
    websiteURL: {
        type: String,
        default: ''
    },
    // The LinkedIn URL of the student
    linkedInURL: {
        type: String,
        default: ''
    },
    // The Twitter URL of the student
    twitterURL: {
        type: String,
        default: ''
    },
    // The Github URL of the student
    githubURL: {
        type: String,
        default: ''
    },
    // The current living location of the student
    location: {
        type: String,
    },
    // The type of development work the student enjoys
    // e.g. Front-End or Back-End
    fieldOfInterest: {
        type: String,
        default: 'I like both'
    },
    // The kind of work a student is seeking
    // e.g. Internship, Full Time, Remote, etc
    seeking: {
        type: Array,
        default: []
    },
    // The student's 'About Me' description
    bio: {
        type: String,
        default: ''
    },
    // The md5 hash of the student's email  used to render
    // the gravatar for the student.
    // The email for a student is stored in the User model used by Passport 
    // to hold all of the authetication information. That model contains a reference
    // to a Student entry ObjectID.
    gravatar: {
        type: String,
        default: ''
    }
})

// Creating a StudentModel variable that will be exported, allowing for
// searches to be performed on this collection in elsewhere in the back-end
// source-code.
const StudentModel = mongoose.model('Student', StudentSchema)

module.exports = { StudentSchema, StudentModel }
