const tap = require('tap')
    , db = require('../routes/service/db')
    , fs = require('fs')
    , path = require('path')
    , { before } = require('tap')

before(() => {
    fs.copyFileSync(
        path.resolve(process.env.PWD, 'db.json'),
        path.resolve(process.env.PWD, 'routes', 'service', 'db.json')
    )
})

tap.type(db.all(), Array)
tap.equal(db.all().length, 1)
tap.type(db.get('name'), Object)
tap.equal(db.get('name').name, 'name')
tap.ok(db.push({
    name: 'name',
    settings: 'settings'
}), 1)
tap.equal(db.push(null), 0)
tap.equal(db.push({
    name: 'name2',
    settings: 'settings2'
}), 1)
tap.equal(db.push({
    settings: 'settings'
}), 0)
tap.equal(db.splice('name2'), 1)
tap.equal(db.splice('mm'), 1)



