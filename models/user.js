const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Using passport-local-mongoose will add a username, hash and salt field
// to store the username, the hashed password and salt value.
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
    // This stores the role of the User, and while not actually
    // used for any deployed User collection entries it was 
    // anticipated that in future iterations this field would be required
    // to set administrator/standard privileges.
    role: {
        type: String,
        default: 'standard'
    },
    // The student that this User entry is associated with, stored as the
    // ObjectID for that user. In this iteration where the only types of
    // authenticated users, this field is required. Future iterations
    // may not, and would see a Model rework to accomodate for other types
    // of users.
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    }
})

// Telling passport to use email rather that username for authentication.
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email', usernameUnique: true } )

// Creating a UserModel variable that will be exported, allowing for
// searches to be performed on this collection in elsewhere in the back-end
// source-code.
const UserModel = mongoose.model('User', UserSchema)

module.exports = { UserSchema, UserModel }
