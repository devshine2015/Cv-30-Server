export default `
    type CardSettings {
        id: Int
        visible: Boolean!
        shareable: Boolean!
    }
    input CardSettingsInput {
        id: Int
        visible: Boolean!
        shareable: Boolean!
    }
`;