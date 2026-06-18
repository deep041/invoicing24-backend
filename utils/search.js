function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildRegexSearch(search) {
    if (!search || !search.trim()) {
        return null;
    }

    return new RegExp(escapeRegex(search.trim()), 'i');
}

function buildOrFilter(fields, search) {
    const regex = buildRegexSearch(search);

    if (!regex) {
        return {};
    }

    return {
        $or: fields.map((field) => ({ [field]: regex }))
    };
}

module.exports = { escapeRegex, buildRegexSearch, buildOrFilter };
