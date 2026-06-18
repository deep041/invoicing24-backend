const express = require('express');
const router = express.Router();
const improvement = require('../controllers').improvement;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, improvement.getImprovements);
router.post('/', authenticateToken, improvement.createImprovement);
router.get('/comments/all', authenticateToken, improvement.getAllComments);
router.get('/:id/comments', authenticateToken, improvement.getCommentsByImprovement);
router.post('/:id/comments', authenticateToken, improvement.addComment);

module.exports = router;
