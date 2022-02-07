const express = require('express')
const path = require("path")
const cors = require('cors')
const morgan = require('morgan')

const api = require("./routes/api")

const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
}))
app.use(morgan('short'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', api)
// app.use('/v2', apiV2) => create new api file (apiV2) with new router => new functions

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app