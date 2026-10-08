import { once } from 'node:events'
import { createServer, type RequestListener, type Server } from 'node:http'

const servers = new WeakMap<RequestListener, Promise<Server>>()

const start = async (app: RequestListener): Promise<Server> => {
  const server = createServer(app).listen(0, '127.0.0.1')
  // Never keeps the test process alive: the server lives as long as its app is used.
  server.unref()
  await once(server, 'listening')
  return server
}

/**
 * Serves `app` on 127.0.0.1 (ephemeral port) and returns the listening server, one per app.
 * Hand the result to supertest instead of the bare app.
 *
 * Given a bare app, supertest runs `app.listen(0)` — every interface — then requests
 * `127.0.0.1:<port>`. The kernel may pick a port another program already holds on
 * 127.0.0.1 alone (macOS allows the wildcard bind): that program then answers the test's
 * request, with a 404 or a 200 the app under test never sent. Bound to the loopback
 * address, such a port is a conflict and is never picked.
 */
export const listenOnLoopback = (app: RequestListener): Promise<Server> => {
  let server = servers.get(app)
  if (!server) {
    server = start(app)
    servers.set(app, server)
  }
  return server
}
