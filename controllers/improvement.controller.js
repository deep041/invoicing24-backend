const { improvement, improvementComment, user } = require('../modals');
const sendResponse = require('../utils/response');

const getImprovements = async (req, res) => {
    try {
        const improvements = await improvement.find().sort({ createdAt: -1 }).lean();
        const commentCounts = await improvementComment.aggregate([
            { $group: { _id: '$improvementId', count: { $sum: 1 } } }
        ]);
        const countMap = Object.fromEntries(commentCounts.map((c) => [c._id.toString(), c.count]));

        const result = improvements.map((item) => ({
            ...item,
            commentCount: countMap[item._id.toString()] || 0
        }));

        sendResponse(res, 200, 200, true, 'Improvements retrieved successfully', result);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to retrieve improvements', null);
    }
};

const createImprovement = async (req, res) => {
    const { title, description, status } = req.body;

    if (!title?.trim()) {
        return sendResponse(res, 400, 400, false, 'Title is required', null);
    }

    try {
        const result = await improvement.create({
            title: title.trim(),
            description: description?.trim() || '',
            status: status || 'open'
        });

        sendResponse(res, 200, 200, true, 'Improvement created successfully', result);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to create improvement', null);
    }
};

const getCommentsByImprovement = async (req, res) => {
    try {
        const comments = await improvementComment
            .find({ improvementId: req.params.id })
            .sort({ createdAt: -1 })
            .lean();

        sendResponse(res, 200, 200, true, 'Comments retrieved successfully', comments);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to retrieve comments', null);
    }
};

const addComment = async (req, res) => {
    const { text } = req.body;
    const improvementId = req.params.id;

    if (!text?.trim()) {
        return sendResponse(res, 400, 400, false, 'Comment text is required', null);
    }

    try {
        const improvementExists = await improvement.findById(improvementId);
        if (!improvementExists) {
            return sendResponse(res, 404, 404, false, 'Improvement not found', null);
        }

        const commentAuthor = await user.findById(req.user.id).select('firstName lastName');
        const userName = commentAuthor
            ? `${commentAuthor.firstName || ''} ${commentAuthor.lastName || ''}`.trim()
            : '';

        const result = await improvementComment.create({
            improvementId,
            userId: req.user.id,
            userName,
            text: text.trim()
        });

        sendResponse(res, 200, 200, true, 'Comment added successfully', result);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to add comment', null);
    }
};

const getAllComments = async (req, res) => {
    try {
        const comments = await improvementComment
            .find()
            .sort({ createdAt: -1 })
            .populate('improvementId', 'title status')
            .lean();

        sendResponse(res, 200, 200, true, 'All comments retrieved successfully', comments);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to retrieve comments', null);
    }
};

module.exports = {
    getImprovements,
    createImprovement,
    getCommentsByImprovement,
    addComment,
    getAllComments
};
