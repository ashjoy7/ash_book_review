const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Ash Book Review API',
    description: 'API for managing book reviews'
  },
  host: 'ash-book-review.onrender.com', // Remove 'https://' as it's not needed here
  schemes: ['https'] // Specify the schemes used by your API
};

const outputFile = './swagger-output.json'; // Adjust the path as needed
const endpointsFiles = ['./routes/index.js']; // Adjust the path to your endpoint file(s)

swaggerAutogen(outputFile, endpointsFiles, doc);
