/**
**Module Dependencies
 */

const app = require('../app');
const debug = require('debug')('backendexpressdevice: server')
const http = require('http');

/**
**Get Port
 */

const port = normalizePort(process.env.PORT || '9090')
app.set('port', port)
console.log('port', port)

/**
**Get Server
 */

const server = http.createServer(app)

server.listen(port, () => console.log(`server listening on port ${port}`))
server.on('error', onError)
server.on('listening', onListening)


function normalizePort(val) {
  const port = parseInt(val, 10)

  if(isNaN(port)) {
    return val
  }

  if(port >= 0) {
    return port
  }

  return false

}

/**
** Event Listener for HTTP server "error" event
 */

function onError(error) {
  if(error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
  ? 'Pipe ' + port
  : 'Port ' + port;

  //handles specific listening errors with messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' You do not have the required privileges')
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break;
    default:
      throw error
  }
}

/**
 * Event Listener for HTTP server Listening Event
 */

function onListening() {
  let addressReturn = server.address()
  let bind = typeof addressReturn === 'string'
  ? 'Pipe ' + addressReturn
  : 'Port ' + addressReturn.port
  debug('Listening on ' + bind)
}
