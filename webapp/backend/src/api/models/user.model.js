const mongoose = require('mongoose');
const argon2 = require('argon2');
const moment = require('moment');
const jwt = require('jwt-simple');
const httpStatus = require('http-status');
const { omitBy } = require('lodash')

const APIError = require('./../../errors/APIError');
const vars = require('./../../config/vars');


/**
* User Roles
*/
const roles = ['user', 'admin'];

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        maxlength: 128,
        index: true,
        trim: true,
    },
    role: {
        type: String,
        enum: roles,
        default: 'user',
    },

}, { timestamps: true })

userSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('password')) return next();

        const hash = await argon2.hash(this.password);
        this.password = hash;

        return next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.passwordMatches = async function (password) {
    return await argon2.verify(this.password, password)
};

userSchema.methods.token = function() {
    const payload = {
        exp: moment().add(vars.jwtExpirationInterval, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id,
    };
    return jwt.encode(payload, vars.jwtSecret);
}

userSchema.methods.transform = function () {
    const transformed = {};
    const fields = ['_id', 'name', 'email', 'role', 'createdAt'];

    fields.forEach((field) => {
        transformed[field] = this[field];
    });

    return transformed;
}

userSchema.statics = {
    roles,

    /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
    async get(id) {
        try {
            let user;
            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }
            throw new APIError({
                message: 'User does not exist',
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    /**
     * Find user by email and tries to generate a JWT token
     *
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email) throw new APIError({ message: 'An email is required to generate a token' });

        const user = await this.findOne({ email }).exec();
        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
        };
        if (password) {
            if (user && await user.passwordMatches(password)) {
                return { user, accessToken: user.token() };
            }
            err.message = 'Incorrect email or password';
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = 'Invalid refresh token.';
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = 'Incorrect email or refreshToken';
        }
        throw new APIError(err);
    },
    /**
 * List users in descending order of 'createdAt' timestamp.
 *
 * @param {number} skip - Number of users to be skipped.
 * @param {number} limit - Limit number of users to be returned.
 * @returns {Promise<User[]>}
 */
    list({
        page = 1, perPage = 30, name, email, role,
    }) {
        const options = omitBy({ name, email, role }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    /**
     * Return new validation error
     * if error is a mongoose duplicate key error
     *
     * @param {Error} error
     * @returns {Error|APIError}
     */
    checkDuplicateEmail(error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            return new APIError({
                message: 'Validation Error',
                errors: [{
                    field: 'email',
                    location: 'body',
                    messages: ['"email" already exists'],
                }],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    },
}

/**
 * @typedef User
 */
module.exports = mongoose.model('User', userSchema);