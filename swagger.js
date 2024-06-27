const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Ash Book Review API',
    description: 'API for managing book reviews',
  },
  host: 'ash-book-review.onrender.com', // Update this with your actual host URL where your Node.js app is running
  schemes: ['https'], // Update to ['https'] if your server uses HTTPS
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js']; // Update with your actual API routes file

swaggerAutogen(outputFile, endpointsFiles, doc);
