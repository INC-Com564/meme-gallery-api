"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
function authenticateToken(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing token' });
    }
    const token = auth.split(' ')[1];
    const userId = Number(token);
    if (Number.isNaN(userId)) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = { userId };
    next();
}
