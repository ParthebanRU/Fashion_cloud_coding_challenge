const supertest = require('supertest')
const app = require('../../index')

describe("Testing the API", () => {
    it("test", async () =>{
        const response = await supertest(app).get('/');
        expect(response.statusCode).toBe(200)
    })
})