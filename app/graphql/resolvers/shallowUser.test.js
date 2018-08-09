const shallowUserResolvers = require('./shallowUser');

const handleShallowUserTest = {
    name: 'Invalid input missing shallowUser and options',
    exec: async () => {
        const args = { shallowUser: undefined, options: undefined };
        const ctx = {
            user: {
                id: 20
            },
            models: {

            }
        };

        //const output = await ;
        
        // await expect(() => shallowUserResolvers.Mutation.handleShallowUser({}, args, ctx)).toThrow();
        return shallowUserResolvers.Mutation.handleShallowUser({}, args, ctx).then(e => {
            expect(e).not.toEqual(null)
        });
    }
}

const handleShallowUserTestNoCtxUser = {
    name: 'No user in context/not logged in',
    exec: async () => {
        const args = { shallowUser: undefined, options: undefined };
        const ctx = {
            models: {

            }
        };

        expect.assertions(1);
        return shallowUserResolvers.Mutation.handleShallowUser({}, args, ctx).catch(e => {
            expect(e).not.toEqual(null)
        });
    }
}

const tests = [
    handleShallowUserTest,
    handleShallowUserTestNoCtxUser
]

describe('shallowUser resolvers', () => {
    describe('handleShallowUser', () => {
        tests.forEach(t => {
            test(t.name, () => Promise.resolve(t.exec()));
        });
    })
});