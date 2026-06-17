const item = require('../modals').item;
const sendResponse = require('../utils/response');

const getItems = async (req, res, next) => {
    await item.find({ 'userId': req.user.id }).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', result);
        } else {
            sendResponse(res, 200, 404, true, 'Failed', result);
        }
    });
}

const createItem = async (req, res, next) => {
    let itemData = {
        name: req.body.name,
        price: req.body.price,
        hsnCode: req.body.hsnCode,
        userId: req.user.id
    }

    item.create(itemData).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Item created successfully!', result);
        } else {
            sendResponse(res, 200, 403, false, 'Item creation failed', result);
        }
    });
}

const editItem = async (req, res, next) => {
    let itemData = {
        name: req.body.name,
        price: req.body.price,
        hsnCode: req.body.hsnCode,
        userId: req.user.id,
        id: req.body.id
    }

    item.updateOne({ _id: itemData.id, userId: req.user.id }, { $set: { name: itemData.name, price: itemData.price } }).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Item updated successfully!', result);
        } else {
            sendResponse(res, 200, 403, false, 'Item update failed', result);
        }
    });
}

module.exports = { getItems, createItem, editItem }