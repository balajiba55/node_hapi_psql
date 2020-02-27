const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    age: Joi.number()
        // .interger()
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
})

exports.userSchema = userSchema;