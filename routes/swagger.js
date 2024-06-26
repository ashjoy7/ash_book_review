const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

// Check if swaggerDocument exists
if (!swaggerDocument) {
    console.error('swagger-output.json not found');
    process.exit(1); // Exit the process if swaggerDocument is not found
}

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

module.exports = router;
