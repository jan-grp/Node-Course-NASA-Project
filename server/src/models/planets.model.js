const fs = require("fs")
const path = require("path")
const { parse } = require('csv-parse')

const planets = require("./planets.mongo")

//const habitablePlanets = []

//function can be read as bool. Value is determed by the returned output
function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' 
        && planet['koi_insol'] > 0.36 
        && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: "#",
            columns: true
        }))
        .on('data', async data => {
            if(isHabitablePlanet(data)){
                //habitablePlanets.push(planet)

                // insert + update = upsert
                await planets.updateOne({
                   keplerName: data.kepler_name,
                }, {
                    keplerName: data.kepler_name
                }, {
                    upsert: true
                })
            } 
        })
        .on('error', err => {
            console.log(err)
            reject(err)
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`We could find ${countPlanetsFound} habitable planets!`)
            resolve()
        })
    })
}

async function getAllPlanets() {
    //return habitablePlanets
    return await planets.find({}, {
        '_id': 0, '__v': 0 //excludes id & __V from db response
    })
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: kepler_name
        }, {
            keplerName: kepler_name
        }, {
            upsert: true
        })
    } catch (err) {
        console.error(`Could not save the planet: ${err}`)
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
}