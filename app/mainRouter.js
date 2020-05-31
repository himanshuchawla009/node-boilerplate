const express = require('express'),
      config  = require('../config/'),
      glob    = require('glob'),
      swaggerUi = require('swagger-ui-express'),
      constants = require("../config/constants"),
      env = require("../config/env"),
      swaggerJSDoc = require('swagger-jsdoc');

const router  = express.Router();
const controllers = glob.sync(`app/${config.app.webApi}/modules/**/route.js`);


let options = {
  swaggerDefinition: {
    info: {
      title: 'Demo Project', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'API docs'
    },
    host: constants.baseUrl,
    basePath: '/api/v1',
    tags: [
      {
        name: 'Transaction',
        description: 'API for transactions in the system'
      }
    ]
  },
  apis: [`${__dirname}/v1/modules/**/route.js`] // Path to the API docs
};

//const swaggerDocument = require('./v1/config/swagger.json');
const swaggerSpec = swaggerJSDoc(options);

router.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});


//router.use('/', swaggerUi.serve);
if(env === 'staging' || env === 'development' || env === 'production'){
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}


controllers.forEach((controller) => {
  let controllerFunction = require(controller);
  controllerFunction(router) 
});
module.exports = router;
