const supertest = require ('supertest')
// const jest = require ('jest')
const student_routes = require ('../routes/student_routes')
const app = require ('../server')

// testing DB Connection


// testing the root path 
describe('test the root path get request', () => {
    test('it should return respond to the GET method', async () =>{
        const response = await request(app).get('/')
        expect(response.statusCode).toBe(200)
        // return request(app).get('/').expect(200)
    })

})


// 

