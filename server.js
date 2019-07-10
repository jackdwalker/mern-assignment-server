const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

// Setting up express server and importing middleware

const app = express()
app.use(morgan('dev')) // Better server logs
app.use(bodyParser.json()) // Parse JSON
app.use(cors()) // Allow CORS

// Initialising MongoDB connection

mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log('Error connecting to database', err)
    } else {
        console.log('Connected to database!')
    }
})

// Routing

app.get('/', (req, res) => res.json({
    msg: 'Testing the root get request'
}))

app.use('/api/students', require('./routes/student_routes'))

app.listen(process.env.PORT || 4000, () => console.log('Listening on http://localhost:4000'))
