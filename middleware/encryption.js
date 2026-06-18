const { encrypt, decrypt } = require('../utils/crypto');

const SKIP_PATHS = new Set(['/']);

function shouldSkipEncryption(req) {
    return SKIP_PATHS.has(req.path);
}

function decryptRequest(req, res, next) {
    if (shouldSkipEncryption(req)) {
        return next();
    }

    if (req.body?.encrypted && typeof req.body.encrypted === 'string') {
        try {
            req.body = JSON.parse(decrypt(req.body.encrypted));
        } catch {
            return res.status(400).json({
                success: false,
                responseCode: 400,
                message: 'Invalid encrypted request payload',
                data: null
            });
        }
    }

    next();
}

function encryptResponse(req, res, next) {
    if (shouldSkipEncryption(req)) {
        return next();
    }

    const originalJson = res.json.bind(res);

    res.json = (body) => {
        try {
            return originalJson({ encrypted: encrypt(JSON.stringify(body)) });
        } catch {
            return originalJson(body);
        }
    };

    next();
}

module.exports = { decryptRequest, encryptResponse };
