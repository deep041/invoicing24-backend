const item = require('../modals').item;
const sendResponse = require('../utils/response');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const getItems = async (req, res, next) => {
    const { page, limit, skip } = parsePagination(req);
    const filter = { userId: req.user.id };

    try {
        const [total, result] = await Promise.all([
            item.countDocuments(filter),
            item.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        ]);

        sendResponse(
            res,
            200,
            200,
            true,
            'Data retrieved successfully',
            buildPaginatedResponse(result, total, page, limit)
        );
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to retrieve items', null);
    }
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