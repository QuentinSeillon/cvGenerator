const { Validator } = require('jsonschema');

module.exports = {
    verifyUser: (user) => {
        if (!user) {
            throw new Error('Cannot create new user');
        }

        let validator = new Validator();
        let userSchema = {
            type: 'object',
            properties: {
                nom: {
                    type: 'string',
                    minLength: 3,
                    errorMessage: 'Nom must be at least 3 characters long'
                },
                prenom: {
                    type: 'string',
                    minLength: 3,
                    errorMessage: 'Prenom must be at least 3 characters long'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    errorMessage: 'Email must be valid'
                },
                password: {
                    type: 'string',
                    minLength: 6,
                    errorMessage: 'Password must be at least 6 characters long',
                    pattern: '^(?=.*[A-Z])(?=.*[0-9]).+$'
                }
            },
            require: ['nom', 'prenom', 'email', 'password']
        };

        let result = validator.validate(user, userSchema);

        if (result.errors.length) {
            const errorInputsMessage = result.errors
                .map((error) => {
                    return error.schema.errorMessage;
                })
                .join(' ');

            throw new Error(errorInputsMessage);
        }
    }
};
