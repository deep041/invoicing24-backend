const { project, improvementComment } = require('../modals');
const sendResponse = require('../utils/response');

const createProject = async (req, res) => {
    const { name, description, commentIds } = req.body;

    if (!name?.trim()) {
        return sendResponse(res, 400, 400, false, 'Project name is required', null);
    }

    try {
        let validCommentIds = [];

        if (Array.isArray(commentIds) && commentIds.length) {
            const existingComments = await improvementComment.find({ _id: { $in: commentIds } }).select('_id');
            validCommentIds = existingComments.map((comment) => comment._id);
        }

        const result = await project.create({
            name: name.trim(),
            description: description?.trim() || '',
            commentIds: validCommentIds,
            createdBy: req.user.id
        });

        const populatedProject = await project
            .findById(result._id)
            .populate({
                path: 'commentIds',
                populate: { path: 'improvementId', select: 'title status' }
            })
            .lean();

        sendResponse(res, 200, 200, true, 'Project created successfully', populatedProject);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to create project', null);
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await project
            .find()
            .sort({ createdAt: -1 })
            .populate({
                path: 'commentIds',
                populate: { path: 'improvementId', select: 'title status' }
            })
            .lean();

        sendResponse(res, 200, 200, true, 'Projects retrieved successfully', projects);
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to retrieve projects', null);
    }
};

module.exports = { createProject, getProjects };
