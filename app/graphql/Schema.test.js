
const {
    makeExecutableSchema,
    addMockFunctionsToSchema,
    mockServer
} = require('graphql-tools');
const { graphql } = require('graphql');

const typeDefs = require('./types');
const testCases = require('./types/index.testCases');

describe('Schema', () => {
    const mockSchema = makeExecutableSchema({ typeDefs });

    // Here we specify the return payloads of mocked types
    addMockFunctionsToSchema({
        schema: mockSchema,
        mocks: {
            StandardResponse: () =>  ({
                status: true,
                error: null
            }),
            Boolean: () => false,
            ID: () => '1',
            Int: () => 1,
            Float: () => 12.34,
            String: () => 'Dog',
            Date: () => new Date()
        }
    });

    test('has valid type definitions', async () => {
        expect(async () => {
            const MockServer = mockServer(typeDefs);

            await MockServer.query(`{ __schema { types { name } } }`);
        }).not.toThrow();
    });

    testCases.forEach(obj => {
        const { id, query, variables, context: ctx, expected } = obj;

        test(`query: ${id}`, async () => {
            const queryExecutionResult = await graphql(mockSchema, query, null, { ctx }, variables);
            return expect(expected(queryExecutionResult)).toEqual(true);
        });
    });
});