const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

require('dotenv').config()

// Importing custom middleware

const { initializePassport } = require('./middleware/tokenCreation')

// Setting up express server and importing middleware

const app = express() // Initialising the app
app.use(morgan('dev')) // Better server logs, allows for easier debugging
app.use(bodyParser.json()) // Allows the reading of page body content in a JSON format
app.use(initializePassport) // Initialising the middleware that will allow us to authenticate
app.use(cors({credentials: true, origin: true})) // Allow CORS requests, including the ability to pass cookies cross-origin
app.use(cookieParser()) // Allow the server to read incoming cookies in request headers from the client-side

// Initialising MongoDB connection

// Mongoose will connect to the live DB if the .env file contains that path in the DB_PATH variable,
// if not found will default to the TEST_DB_PATH .env variable which should be your local MongoDB path

mongoose.connect(process.env.DB_PATH || process.env.TEST_DB_PATH, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Error connecting to database', err)
    } else {
        console.log('Connected to database!')
    }
})

// Routing

app.use('/api/auth', require('./routes/authenticate_routes')) // Calling in our authentication API routes
app.use('/api/students', require('./routes/student_routes')) // Calling in our student information API routes

// Telling our application to listen on the PORT environment variable which is automatically and dynamically
// set by Heroku. This will be different or may need to be manually set if this server is deployed on a different
// environment. By default if it does not find this environment variable it will listen on port 4000.

app.listen(process.env.PORT || 4000, () => console.log('Listening on http://localhost:4000'))
