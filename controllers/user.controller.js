const user = require('../modals').user;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAllUsers = async (req, res, next) => {
    const allUsers = await user.find();
    res.send({ message: 'Data retrieve successfully!!', data: allUsers, status: 200});
}

module.exports = { getAllUsers }