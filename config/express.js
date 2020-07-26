const express    = require('express'),
      morgan     = require("morgan"),
      bodyParser = require('body-parser');


  module.exports = function (app, config) {
  let env = require('./env');//process.env.NODE_ENV || 'staging';
  app.locals.ENV = env;
  app.locals.env = env;
  app.locals.ENV_DEVELOPMENT = env === 'development';
  app.set('env',env);
  const logger = require('./logger');	


  app.use(bodyParser.json({limit:'50mb',strict: false}));
  app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
  app.use(morgan('dev',{ 'stream': logger.stream }));
  var http = require('http').Server(express);
  var io = require('socket.io')(http);
  //app.use(cookieParser());

  /* app.use((req, res, next) => {
		var id = req.ip;
		var limit = new rateLimiter({ id: id, db: redisClient });
		limit.get(function (err, limit) {
			if (err) return next(err);

			res.set('X-RateLimit-Limit', limit.total);
			res.set('X-RateLimit-Remaining', limit.remaining - 1);
			res.set('X-RateLimit-Reset', limit.reset);

			// all good 
			console.error('remaining %s/%s %s', limit.remaining - 1, limit.total, id);
			if (limit.remaining) return next();

			// not good 
			var delta = (limit.reset * 1000) - Date.now() | 0;
			var after = limit.reset - (Date.now() / 1000) | 0;
			res.set('Retry-After', after);
			res.send(429, 'Rate limit exceeded, retry in ms' + (delta, { long: true }));
		});
	}); */

  //app.use(methodOverride());
  //app.use(expressValidator(validator.customSanitizers));
  //app.use('/public', express.static(config.root + '/web/public'));
  app.use(express.static(`${config.root}/web/public`));

  app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Origin, X-Requested-With,Authorization, x-access-token,Accept');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  app.use(`/api/${config.app.webApi}`, require('app/mainRouter'));

  //The 404 Route (ALWAYS Keep this as the last route)
	
  app.all('*', (req, res) => {
    res.status(404).json({
      'success' : false,
      'message': 'no such api exists'
    });
  });

};

