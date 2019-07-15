const mongoose = require('mongoose')
// Using passport-local-mongoose will add a username, hash and salt field
// to store the username, the hashed password and salt value.
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'student'
    }
})

// Use email as login field, not username
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' })

const UserModel = mongoose.model('User', UserSchema)

module.exports = { UserSchema, UserModel }
