const Salary = `
    type Salary {
        amount: Float
        currency: Currency
        isPublic: Boolean
    }
    input SalaryInput {
        amount: Float
        currency: Currency
        isPublic: Boolean
    }
`;

module.exports = () => [Salary];