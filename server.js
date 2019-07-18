const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const withAuth = require('./middleware/withAuth')

require('dotenv').config()

// Importing custom middleware

const { initializePassport, requireJwt } = require('./middleware/tokenCreation')

// Setting up express server and importing middleware

const app = express()
app.use(morgan('dev')) // Better server logs
app.use(bodyParser.json()) // Parse JSON
app.use(initializePassport)
app.use(cors({credentials: true, origin: true})) // Allow CORS
app.use(cookieParser())

// Initialising MongoDB connection

mongoose.connect(process.env.DB_PATH || process.env.TEST_DB_PATH, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Error connecting to database', err)
    } else {
        console.log('Connected to database!')
    }
})

// Routing

app.use('/api/auth', require('./routes/authenticate_routes'))
app.use('/api/students', require('./routes/student_routes'))

app.get('/api/secret', withAuth, function(req, res) {
    res.send('You are authorized yayyyyy!')
})

app.get('/', (req, res) => res.json({
    msg: 'Testing the root get request'
}))

app.listen(process.env.PORT || 4000, () => console.log('Listening on http://localhost:4000'))
