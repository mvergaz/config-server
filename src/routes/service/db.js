"use strict"

const { writeFileSync, readFileSync } = require("fs")
    , path = require('path')
    , json = path.resolve(process.env.PWD, 'routes', 'service', 'db.json')
module.exports = {
    save: function (db) {
        writeFileSync(json, JSON.stringify(db))
        return 1
    },

    all: function () {
        return Array.from(JSON.parse(readFileSync(json).toString()))
    },

    get: function (name) {
        return this.all().find(k => k.name == name)
    },

    push: function (config) {
        if (!config || !config.name) {
            return 0
        }
        let { name } = config
        let db = this.all()
            , pos = db.findIndex(k => k.name == name)
        if (pos < 0)
            db.push(config)
        else
            db[pos] = config
        this.save(db)
        return 1
    },

    splice: function (name) {
        let db = this.all()
            , pos = db.findIndex(k => k.name == name)
        if (pos > -1) {
            db.splice(pos, 1)
            this.save(db)
        }
        return 1
    }
}