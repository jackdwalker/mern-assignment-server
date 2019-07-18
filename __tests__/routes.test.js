import request from 'supertest'
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')



// const app = ()

// testing login with correct credentials 
// it('suceeeds with correct login credentials', async () => {
//     const response = await post(`login`, testStudent)
//     .expect(200)
//     expect(res.body.student.email).toBe(testStudent.email)
// })

// // test with incorrect credentials
// it('fails with incorrect credentials', async () => {
//     const student = {email: 'notarealuser@test.com', password: 'notrealpassword'}
//         await post(`login`, student)
//         .expect(400)
// })

// // test with missing credentials
// it('fails with missing credentials', async () => {
//     const user = {}
//     await post(`login`, user)
//     .expect
// })

