const Value = `
    type Value {
        id: Int
        i18n: [ValueText]
    }
`;

const ValueText = `
    type ValueText {
        title: String
    }
`;

module.exports = () => [Value, ValueText];