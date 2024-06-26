const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Book Review API',
    description: 'API for managing book reviews',
  },
  host: 'book-review-api-7zsi.onrender.com', 
  schemes: ['https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
