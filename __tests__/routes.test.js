const supertest = require ('supertest')
// const jest = require ('jest')
const student_routes = require ('../routes/student_routes')
const app = require ('../server')

// testing DB Connection
describe 


// testing the root path 
describe('test the root path get request', () => {
    test('it should return respond to the GET method', async () =>{
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        // return request(app).get('/').expect(200)
    })

})

// testing the authenticate_routes
describe('it should return a 200 for a route that sends back an authorised token',() => {
    test('it should return a 200 for a authorised token', async () => {
        const response = await request(app).get( )
    }
})



// 

