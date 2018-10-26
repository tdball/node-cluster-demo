import * as cluster from 'cluster'
import {Worker} from 'cluster'
import * as os from 'os'
import * as R from 'ramda'
import { createServer, Server } from 'http'

const server: Server = createServer((request, response) => {
    response.writeHead(200)
    response.end('Hello World')
})
const cpuCores: number = os.cpus().length
if (cluster.isMaster) {
    // Create a fork per core.
    R.range(0, cpuCores).map(
        () => cluster.fork()
    )
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
        console.log(`Caught signal: ${signal}`)
        worker.kill()
        console.log(`Worker ${worker.process.pid} stopped.`)
    })
    console.log(`${cpuCores} Workers starting. Listening on port 3000`)
} else {
    server.listen(3000)
    console.log(`Worker: ${process.pid}`)
}