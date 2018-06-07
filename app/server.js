const debug = require('debug');
const cluster = require('cluster');
const numCPUs = require('os');
const express = require('express');
// const ioServer = require('socket.io');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const apolloServer = require('apollo-server-express');
const schema = require('./graphql');
const db = require('./models');
// const ioLoad = require('./io');
const dotenv = require('dotenv');
const migrate = require('./migrate');
const getContext = require('./context');

dotenv.config();

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    migrate(db, () => {
        for (let i = 0; i < numCPUs.cpus().length; i++) {
            cluster.fork();
        }
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();
    const server = http.createServer(app);
    // const io = ioServer.listen(server);

    app.set('models', db);
    // app.set('io', io);
    app.use(cors());
    app.use('/graphql', bodyParser.json(), apolloServer.graphqlExpress(async req => {
        const { user, models } = await getContext(req);
        console.log(user);
        return {
            schema,
            context: { user, models },
            graphiql: true,
            // formatError: error => {
            //     console.log(error)
            // },
            debug: true
        };
    }));
    app.use('/graphiql', apolloServer.graphiqlExpress({
        endpointURL: '/graphql'
    }));

    app.get('*', (req, res) => res.send(''));

    // ioLoad(io);

    server.listen(process.env.PORT, () => {
        console.log('Express server listening on port ' + server.address().port);
    });
    app.on('error', (error) => {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof process.env.PORT === 'string'
            ? 'Pipe ' + process.env.PORT
            : 'Port ' + process.env.PORT;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    app.on('listening', () => {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Listening on ' + bind);
    });
}
