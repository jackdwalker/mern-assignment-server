const mongoose = require('mongoose')

const Schema = mongoose.Schema

const StudentSchema = new Schema ({
    name: {
        type: String,
        required: true
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
    bio: String,
    gravatar: {
        type: String,
        default: ''
    }
})

const StudentModel = mongoose.model('Student', StudentSchema)

module.exports = { StudentSchema, StudentModel }
