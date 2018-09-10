// const debug = require('debug');
// const cluster = require('cluster');
// const numCPUs = require('os');
// const express = require('express');
// const http = require('http');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const apolloServer = require('apollo-server-express');
// const cookieParser = require('cookie-parser');
// const schema = require('./graphql');
// const db = require('./models');
// const dotenv = require('dotenv');
// const migrate = require('./migrate');
// const getContext = require('./context');

// dotenv.config();

// if (cluster.isMaster) {
//     console.log(`Master ${process.pid} is running`);
//     migrate(db, () => {
//         for (let i = 0; i < numCPUs.cpus().length; i++) {
//             cluster.fork();
//         }
//     });

//     cluster.on('exit', (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//         cluster.fork();
//     });
// } else {
//     const app = express();
//     const server = http.createServer(app);

//     app.set('models', db);
//     app.use(cors({
//         origin: process.env.NODE_ENV === 'production' ? process.env.APP_HOST : 'http://localhost:3000',
//         credentials: true
//     }));
//     app.use(
//         '/graphql',
//         bodyParser.json(),
//         cookieParser(process.env.COOKIE_SECRET, {}),
//         apolloServer.graphqlExpress(async (req, res) => {
//             const { user, models } = await getContext(req, res);
//             return {
//                 schema,
//                 context: { user, models, res },
//                 graphiql: true,
//                 formatError: error => {
//                     if (typeof error === "object" && Object.keys(error).indexOf('message') !== -1) {
//                         if (typeof error.message === 'string') {
//                             try {
//                                 let result = JSON.parse(error.message);
//                                 return Array.isArray(result) ? result : [result];
//                             }
//                             catch (err) {
//                                 return [{ message: error.message }];
//                             }
//                         }
//                     }
//                 },
//                 debug: true
//             };
//         })
//     );
//     app.use('/graphiql', apolloServer.graphiqlExpress({
//         endpointURL: '/graphql'
//     }));

//     app.get('*', (req, res) => res.send(''));

//     server.listen(process.env.PORT, () => {
//         console.log('Express server listening on port ' + server.address().port);
//     });
//     app.on('error', (error) => {
//         if (error.syscall !== 'listen') {
//             throw error;
//         }
//         const bind = typeof process.env.PORT === 'string'
//             ? 'Pipe ' + process.env.PORT
//             : 'Port ' + process.env.PORT;
//         switch (error.code) {
//             case 'EACCES':
//                 console.error(bind + ' requires elevated privileges');
//                 process.exit(1);
//                 break;
//             case 'EADDRINUSE':
//                 console.error(bind + ' is already in use');
//                 process.exit(1);
//                 break;
//             default:
//                 throw error;
//         }
//     });
//     app.on('listening', () => {
//         const addr = server.address();
//         const bind = typeof addr === 'string'
//             ? 'pipe ' + addr
//             : 'port ' + addr.port;
//         console.log('Listening on ' + bind);
//     });
// }

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql');
const db = require('./models');
const dotenv = require('dotenv');
const migrate = require('./migrate');
const getContext = require('./context');
const ALLOWED_ORIGINS = [
    'http://localhost:3000'
];
const corsOptions = {
    // origin: function (origin, callback) {
    //     if (ALLOWED_ORIGINS.indexOf(origin) !== -1) callback(null, true);
    //     else callback(new Error('Not allowed by CORS'));
    // },
    origin: 'http://localhost:3000',
    credentials: true
}

dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(
    bodyParser.json(),
    cookieParser(process.env.COOKIE_SECRET, {})
);

const server = new ApolloServer({
    ...schema,
    cors: corsOptions,
    context: async ({req, res}) => ({ ...await getContext(req, res), res }),
    formatError: error => {
        console.log(error);
        if (typeof error === "object" && Object.keys(error).indexOf('message') !== -1) {
            if (typeof error.message === 'string') {
                try {
                    let result = JSON.parse(error.message);
                    return Array.isArray(result) ? result : [result];
                }
                catch (err) {
                    return [{ message: error.message }];
                }
            }
        }
    }
});
server.applyMiddleware({ app });
    
migrate(db, () => app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
));
// migrate(db, () => server.listen()
//     .then(({ url }) => {
//         console.log(`🚀 Server ready at ${url}`);
//     })
//     .catch(error => {
//         console.error('Could not start graphql server');
//         console.error(error);
//     })
// );