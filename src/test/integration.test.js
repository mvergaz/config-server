const tap = require('tap')
    , http = require('http')
    , db = require('../routes/service/db')
    , fs = require('fs')
    , path = require('path')
    , { before } = require('tap');

function copyDb() {
    fs.copyFileSync(
        path.resolve(process.env.PWD, 'db.json'),
        path.resolve(process.env.PWD, 'routes', 'service', 'db.json')
    )
}

function request(url, options = {}, data = null) {

    return new Promise((resolve, reject) => {
        let buffer = ""
        const req = http.request(url, options, res => {
            res.on("data", (data) => buffer += data.toString())
            res.on("error", (err) => reject(err.message))
            res.on("close", () => resolve(buffer))
        })
        if (data) {
            req.write(data)
        }
        req.end()
    })
}

(async () => {
    try {
        copyDb()
        const data = db.all()
            , res = await request('http://localhost:3000/service/')
            , all = Array.from(JSON.parse(res))
        tap.same(all, data)
    } catch (e) { console.log(e) }
})();

(async () => {
    try {
        copyDb()
        const data = db.get('name')
            , res = await request('http://localhost:3000/service/name')
            , name = JSON.parse(res)
        tap.same(name, data)
    } catch (e) { console.log(e) }
})();

(async () => {
    try {
        copyDb()
        const name2 = JSON.stringify({
            name: 'name2',
            settings: "settings2"
        })
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(name2)
            }
        }
        let res = await request('http://localhost:3000/service/', options, name2)
        tap.same(res, 1)
    } catch (e) { console.log(e) }
})();

(async () => {
    try {
        copyDb()
        const res = await request('http://localhost:3000/service/name2', { method: "DELETE" })
        tap.same(res, 1)
    } catch (e) { console.log(e) }
})();