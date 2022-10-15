const express = require('express')
const app = express()
const port = 3000
const geoip = require('geoip-lite')
const requestIp = require('request-ip');

app.get('/', (req, res) => {
    return res.send("hello")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/about', (req, res) => {
    return res.send("TH15 15 AB0UT PAG3")
})

app.get('/ip', (req, res) => {
    return res.send(requestIp.getClientIp(req))
})


app.get('/verify/:userId/:code', (req, res) => {
    return res.send(req.params)
})