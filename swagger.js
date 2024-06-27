const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Ash Book Review API',
    description: 'API for managing book reviews'
  },
  host: 'https://ash-book-review.onrender.com', 
  schemes: ['https'] 
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['/.routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
