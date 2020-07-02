const app = require("express")(),
  mongoose = require("mongoose"),
  env = require('./config/env'),
  config = require("./config/index"),
  { errors } = require('celebrate'),
  cors = require("cors");


// Adding the root project directory to the app module search path:
require('app-module-path').addPath(__dirname);
const logger = require('./config/logger.js');


app.locals.rootPath = __dirname;
app.set('rootPath', __dirname);

app.use(cors());
app.options('*', cors());


require('./config/express')(app, config);


app.use(errors());
app.use((err, req, res, next) => {
  let resObj = {};
  const error = err.stack ? err.stack : err;
  const status = err.status ? err.status : 500;
  console.error('ERROR -> ', error);
  if (env === 'staging' || env === 'production') {
    resObj = { success: false, description: typeof err === 'object' ? err.message : err, message: !!err.message ?  err.message : 'Something broke!' };
  } else {
    resObj = { success: false, description: err.message, message: !!err.message ?  err.message : 'Something broke!', error };

  }

  res.status(status).json(resObj);
});


mongoose.connect(config.db, {
  auto_reconnect: true,
  useNewUrlParser: true,
  socketOptions: {
    keepAlive: 500,
    connectTimeoutMS: 90000,
    socketTimeoutMS: 90000
  },
  connectWithNoPrimary: true
}, (err) => {
  if (err) {
    logger.info("❌ " + "Mongodb Connection Error");
    logger.error(err);
  } else {
    logger.info("✅ " + "Mongodb Connected");
  }

});

const db = mongoose.connection;

db.on("error", () => {
  //console.log(`${"❌ " + "Unable to connect to database at "}${config.db}`)
  throw new Error(`${"❌ " + "Unable to connect to database at "}${config.db}`);
});
db.once("open", () => {
  logger.info(`${"✅ " + "Connected to Database : "}${config.db.substring(config.db.lastIndexOf("/") + 1, config.db.length)}`);
});


process.on('unhandledRejection', (reason, p) => {
  logger.error('UNHANDLED REJECTION', reason, p);
  // mailer({ mailType: 'EXCEPTION_CAUGHT', to: constants.alertEmail, data: { error: reason, errorStack: reason.stack } });
});

process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION', error);
  // mailer({ mailType: 'EXCEPTION_CAUGHT', to: constants.alertEmail, data: { error: error, errorStack: error.stack } });
  //errorManagement.handler.handleError(error);
  //if(!errorManagement.handler.isTrustedError(error))
  process.exit(1);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});




app.listen(config.port, () => {
  console.log(`Express server listening on port ${config.port}\nOn env : ${env}`);
})

