const NodeCache = require('node-cache');
const tokenCache = new NodeCache({ stdTTL: 3600 }); // Tokens expire in 1 hour

module.exports = tokenCache;