const httpStatus = require("http-status")
const Blog = require('./../models/blogs.model')


exports.getBlogs = async (req, res, next) => {
    try {
        let fields = [];
        if (req.query.fields) {
            fields = req.query.fields.split(",")
        }
        const data = await Blog.getBlogs(fields)
        res.status(httpStatus.OK)
        res.send(data)
    } catch (e) {
        next(e)
    }
}


exports.postBlog = async (req, res, next) => {
    const userId = req.user._id
    if (req.body.userEmail === req.user.email) {
        const whole_data = { ...req.body, userId: userId }
        try {
            new Blog(whole_data).save()
            res.status(httpStatus.CREATED);
            return res.json({ message: "Blog Created" });
        } catch (e) {
            next(e)
        }
    } else {
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'Validation error on email matching',
        });
    }
}

exports.editBlog = async (req, res, next) => {
    try {
        const doc = await Blog.updateBLog(req.query.id, req.body)
        res.status(httpStatus.CREATED)
        return res.json({ message: "Blog updated", update: doc });
    } catch (e) {
        next(e)
    }
}

exports.deleteBlog = async (req, res, next) => {
    try {
        await Blog.deleteBlog(req.query.id)
        const data = await Blog.getBlogs(req.user._id)
        res.status(httpStatus.OK)
        res.send(data)
    } catch (err) {
        next(err)
    }
}