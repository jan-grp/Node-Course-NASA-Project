const request = require("supertest")
const app = require('../../server/src/app')
const { 
    mongoConnect,
    mongoDisconnect
} = require("../src/services/mongo")

describe('Launches API', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect()
    })

    describe('GET /v1/launches', () => {
        test('Responds with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect(200)
                .expect('Content-Type', /json/)
    
            expect(response.statusCode).toBe(200)
        })
    })
    
    describe('POST /v1/launch', () => {
        const correctLaunchData = {
            mission: "USS Enterprise",
            rocket: "Starship",
            target: "Kepler-186 f",
            launchDate: "December 6, 2028"
        }
    
        const correctLaunchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "Starship",
            target: "Kepler-186 f",
        }
    
        test("Responds with 201 success", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(correctLaunchData)
                .expect(201)
                .expect('Content-Type', /json/)
    
            expect(response.body).toMatchObject(Object.assign(correctLaunchData, {
                launchDate: "2028-12-05T23:00:00.000Z"
            }))
        })
    
        test("Catches missing required properties", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(correctLaunchDataWithoutDate)
                .expect(400)
                .expect('Content-Type', /json/)
    
            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })
        })
    
        test("Catches invalid dates", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send({
                    mission: "USS Enterprise",
                    rocket: "Starship",
                    target: "Kepler-186 f",
                    launchDate: "cock 21"
                })
                .expect(400)
                .expect('Content-Type', /json/)
    
            expect(response.body).toStrictEqual({
                error: "Invalid launch date"
            })
        })
    })
})