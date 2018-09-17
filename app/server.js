const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
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
    origin: function (origin, callback) {
	if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || origin && origin.indexOf('cv30.co') !== -1 || process.env.NODE_ENV === "development") callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}

dotenv.config();

const app = express();
app.use(
    bodyParser.json(),
    cookieParser(process.env.COOKIE_SECRET, {})
);
app.use('/health-check', function(req, res) { res.status(200).json('success'); } );

const server = new ApolloServer({
    ...schema,
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
server.applyMiddleware({ app, cors: corsOptions });
    
migrate(db, () => app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
));
