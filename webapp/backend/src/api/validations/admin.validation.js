const Joi = require('joi')

module.exports = {
    postBlog: {
        body: Joi.object({
            title: Joi.string()
                .min(10)
                .required(),
            body: Joi.string()
                .required(),
            userEmail: Joi.string()
                .email()
                .required()
        }),
    },
    editBlog: {
        query: Joi.object({
            id: Joi.string()
        }),
        body: Joi.object({
            title: Joi.string()
                .min(10),
            body: Joi.string()
        }),
    },
    deleteBlog: {
        query: Joi.object({
            id: Joi.string().required()
        })
    }
}