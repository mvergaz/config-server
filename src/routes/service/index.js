"use strict"

const db = require('./db')

module.exports = async function (fastify, opts) {

    fastify.get('/:name', {
        schema: {
            params: {
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            }
        }
    }, async function (request, reply) {
        try {
            let { params } = request
            return (params && params.name)
                ? db.get(params.name)
                : db.all()
        } catch (e) {
            throw fastify.httpErrors.notAcceptable()
        }
    })

    fastify.post('/', {
        schema: {
            body: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' }
                }
            }
        }
    }, async function (request, reply) {
        if (!request.body) {
            throw fastify.httpErrors.notAcceptable()
        }
        let response = db.push(request.body)
        if (!response)
            throw fastify.httpErrors.notAcceptable()
        else
            return response
    })

    fastify.delete('/:name', {
        schema: {
            params: {
                type: 'object',
                required: ['name'],
                properties: {
                    name: { type: 'string' }
                }
            }
        }
    }, async function (request, reply) {
        const { name } = request.params
        return db.splice(name)
    })
}