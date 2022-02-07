const express = require('express')
const { validate } = require('express-validation');
const { authorize, ADMIN } = require('./../auth')


const {editBlog, postBlog, deleteBlog} = require('./../validations/admin.validation')

const router = express.Router()

const adminController = require('../controllers/admin.controller')

router.route('/blog')
    .get(authorize(ADMIN), adminController.getBlogs)
    .post(authorize(ADMIN), validate(postBlog), adminController.postBlog)
    .put(authorize(ADMIN), validate(editBlog), adminController.editBlog)
    .delete(authorize(ADMIN), validate(deleteBlog), adminController.deleteBlog)

router.route('/user')
    .get(authorize(ADMIN))

module.exports = router