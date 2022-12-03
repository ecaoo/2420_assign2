// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const fs = require("fs")

// Declare a route
fastify.get('/api', async (request, reply) => {
        const readStream = fs.createReadStream('../html/index.html')
        await reply.type('text/html').send(readStream)
})

// Run the server!
const start = async () => {
        try {
                await fastify.listen(5050)
        } catch (err) {
                fastify.log.error(err)
                process.exit(1)
        }
}
start()
