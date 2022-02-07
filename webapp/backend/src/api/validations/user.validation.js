const Joi = require('joi')

module.exports = {
    // POST /api/auth/register
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
    deleteBlog: {
        query: Joi.object({
            id: Joi.string().required()
        })
    }
}
