const supertest = require ('supertest')
// const jest = require ('jest') jest not required in this import 
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

// this test was failing so wrote test below
// // testing the authenticate_routes 
// describe('it should return a 200 for a route that sends back an authorised token',() => {
//     test('it should return a 200 for a authorised token', async () => {
//         const response = await request(app).get()

//     })
// })


describe("GET /secure/:id", () => {
    test("authorizes only correct users", async () => {
      const response = await request(app)
        // set isLoggedIn flag to true in local storage with the token, and go to the same ID as the one stored in the token
        .get(`/users/secure/${auth.current_user_id}`)
        .set("authorization", auth.token);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe(res.cookie)
    })
  })


// testing for a 401 on a user not logged in
describe("GET /users without auth", () => {
    test("requires login", async () => {
      // don't add an authorization header with the token...see what happens!
      const response = await request(app).get("/users/")
      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Invalid token')
    })
  })




