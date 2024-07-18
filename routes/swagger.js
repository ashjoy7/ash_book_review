const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

// Check if swaggerDocument exists
if (!swaggerDocument) {
    console.error('swagger-output.json not found');
    process.exit(1); // Exit the process if swaggerDocument is not found
}

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;
