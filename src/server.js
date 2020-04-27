const fastify = require('fastify')
const loaders = require('./loaders')
const crawlerModule = require('./modules/crawler')

const { NODE_ENV, PORT } = process.env

const server = fastify({
  ignoreTrailingSlash: true,
  logger: { level: NODE_ENV !== 'production' ? 'debug' : 'info' },
})

const main = async () => {
  try {
    await server.register(loaders.spiderman)

    server.register(crawlerModule.router)

    await server.listen(PORT, '::') // listen to all IPv6 and IPv4 addresses
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
