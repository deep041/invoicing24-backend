const user = require('../modals').user;
const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/response');
const Joi = require('joi');

const login = async (req, res, next) => {

    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    const { error, value } = loginSchema.validate(req.body);

    if (error) {
        return sendResponse(res, 200, 400, false, error.details[0].message);
    }

    await user.findOne({'email': req.body.email, 'password': req.body.password}).then((result, err) => {
        if (result) {
            const token = jwt.sign({ id: result._id, email: result.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            sendResponse(res, 200, 200, true, 'Login Successfully', { firstName: result.firstName, lastName: result.lastName, email: result.email, token });
        } else {
            sendResponse(res, 200, 404, true, 'Login Failed', result);
        }
    });
}

const register = async (req, res, next) => {
    let userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    }

    await user.findOne({'email': req.body.email}).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 403, false, 'Email already exist.');
        } else {
            user.create(userData).then((result2, err) => {
                if (result2) {
                    sendResponse(res, 200, 200, true, 'Registered Successfully', result2);
                } else {
                    sendResponse(res, 200, 403, false, 'Registered Failed', result2);
                }
            });
        }
    });
}

module.exports = { login, register }