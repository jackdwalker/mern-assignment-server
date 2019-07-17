const mongoose = require('mongoose')

const Schema = mongoose.Schema

const StudentSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    avatarURL: {
        type: String,
        default: ''
    },
    techStack: {
        type: Array,
        default: []
    },
    websiteURL: String,
    linkedInURL: {
        type: String,
        default: ''
    },
    twitterURL: {
        type: String,
        default: ''
    },
    githubURL: {
        type: String,
        default: ''
    },
    graduated: Date,
    hireable: {
        type: String,
        default: false
    },
    location: {
        type: String,
    },
    fieldOfInterest: {
        type: String,
        default: 'I like both'
    },
    seeking: {
        type: Array,
        default: []
    },
    bio: String
})

const StudentModel = mongoose.model('Student', StudentSchema)

module.exports = { StudentSchema, StudentModel }
