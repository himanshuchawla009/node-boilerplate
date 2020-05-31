const path = require("path");
let rootPath = path.normalize(`${__dirname}/..`),
  env = require("./env");


const config = {
  development: {
    root: rootPath,
    app: {
      name: "logistics",
      domain: "http://localhost:8030",
      webApi: "v1"
    },
    port: process.env.PORT || 3000,
    db: "mongodb://himanshu:himanshu@localhost:27017/logistics"
  },
  staging: {
    root: rootPath,
    app: {
      name: "logistics",
      domain: "http://localhost:8030",
      webApi: "v1"
    },
    port: process.env.PORT || 3000,
    db:  "mongodb://himanshu:himanshu@localhost:27017/logistics"
  },
  production: {
    root: rootPath,
    app: {
      name: "logistics",
      domain: "http://localhost:8030",
      webApi: "v1"
    },
    port: process.env.PORT || 3000,
    db:  "mongodb://localhost:27017/logistics"
  }
};


module.exports = config[env];
