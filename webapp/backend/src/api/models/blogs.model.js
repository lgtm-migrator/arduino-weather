const mongoose = require('mongoose')

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userEmail: {
        type: 'String',
        ref: 'User',
        required: true,
    },
}, { timestamps: true })


blogsSchema.statics = {
    async getBlogs(fealds) {
        try {
            const blogs = await this.find().select(fealds).exec();
            if (blogs) {

                return blogs;
            }
            throw new APIError({
                message: 'Find blogs failed',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    async getUserBlogs(id) {
        try {
            let blogs;
            if (mongoose.Types.ObjectId.isValid(id)) {
                blogs = await this.find({ userId: id }).select(['title', 'body', 'userEmail', 'createdAt']).exec();
            }
            if (blogs) {

                return blogs;
            }
            throw new APIError({
                message: 'Find blogs failed',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    async updateBLog(id, update) {
        try {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const doc = await this.findByIdAndUpdate(id, update).save()
                if (doc) {
                    return doc
                }
            }
            throw new APIError({
                message: 'Update Blog failed',
                status: httpStatus.NOT_FOUND,
            });
        }
        catch (error) {
            throw error;
        }
    },

    async deleteBlog(id) {
        try {
            let del;
            if (mongoose.Types.ObjectId.isValid(id)) {
                del = await this.findByIdAndRemove(id).exec();
            }
            if (del) {
                return del
            }
            throw new APIError({
                message: 'User does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },
}

/**
 * @typedef Blogs
 */
const Blogs = mongoose.model('blogsSchema', blogsSchema);
module.exports = Blogs;
