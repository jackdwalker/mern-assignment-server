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
        type: String,
        enum: ['Ruby', 'HTML', 'CSS', 'Javascript', 'Mongo', 'Express', 'React', 'Node'],
        default: 'Ruby'
    },
    websiteURL: String,
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
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        enum: ['Brisbane', 'Sydney', 'Melbourne']
    },
    fieldOfInterest: {
        type: String,
        enum: ['Front-end', 'Back-end', 'I like both'],
        default: 'I like both'
    },
    seeking: {
        type: String,
        enum: ['Remote Full-Time', 'Remote Part-Time', 'Local Full-Time', 'Local Part-Time', 'Internship'],
        default: 'Internship'
    },
    bio: String
})

const StudentModel = mongoose.model('Student', StudentSchema)

module.exports = { StudentSchema, StudentModel }
