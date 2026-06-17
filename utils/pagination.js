const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function parsePagination(req) {
    const page = Math.max(DEFAULT_PAGE, parseInt(req.query.page, 10) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

function buildPaginatedResponse(items, total, page, limit) {
    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: total === 0 ? 0 : Math.ceil(total / limit)
        }
    };
}

module.exports = { parsePagination, buildPaginatedResponse };
