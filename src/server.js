const express = require('express')
const app = express()
const db = require('./config/connect')
db.connect()
const port = 4000
const routerV1 = require('./router/index')
const bodypaser = require('body-parser')
const cookiepaser = require('cookie-parser')
const cors = require("cors")
const hpp = require('hpp')
const helmet = require('helmet')
const morgan = require('morgan')

app.use(cookiepaser());
app.use(bodypaser.json())
app.use(cors())
app.use(hpp())
app.use(helmet())
app.use(morgan('combined'))


routerV1(app)

app.listen(port,()=>{
    console.log(`App listening on port ${port}`)
})
