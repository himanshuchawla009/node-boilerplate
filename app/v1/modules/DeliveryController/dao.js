date = require('../../../../utils/datesHelper'),
_ = require('lodash');

const find = function ({
model=model,
params = {},
sort = {},
skip = 0,
limit = 0,
selector = '',
query = '',
cb = () => { } // eslint-disable-line
}) {
return new Promise((resolve, reject) => {
  model.find(params, (err, data) => {
    if (!err) {
      resolve(data);
      return cb(err, data);
    } else {
      reject(err);
      return cb(err, false);
    }
  })
    .sort(sort)
    .select(selector)
    .populate(query)
    .skip(skip)
    .limit(limit);
});
};

const findOne = function ({
model=model,
params = {},
selector = '',
query = '',
cb = () => { } // eslint-disable-line
}) {
return new Promise((resolve, reject) => {
  model.findOne(params, (err, data) => {
    if (!err) {
      resolve(data);
      return cb(err, data);
    } else {
      reject(err);
      return cb(err, false);
    }
  })
    .select(selector)
    .populate(query);
});

};

const findById = ({
model=model,
id = '',
projection = '',
options = {},
cb = () => { } // eslint-disable-line
}) => {
return new Promise((resolve, reject) => {
  model.findById(id, projection, options, (err, result) => {
    if (!err) {
      resolve(result);
      return cb(err, result);
    } else {
      reject(err);
      return cb(err, false);
    }
  })
    .select(projection);
});
};

const create = function ({
model=model,
obj,
cb = () => { } // eslint-disable-line
}) {
return new Promise((resolve, reject) => {
  obj = _.omit(obj, ['_id', 'createdAt', 'loginAt', 'updatedAt', 'unblockAt', 'isBlocked', 'isActive', 'attempts']);
  obj.createdAt = date.unixTimestamp();
  console.log("data", obj)
  new model(obj).save((err, data) => {
    if (!err) {
      resolve(data);
      return cb(false, data);
    } else {
      reject(err);
      return cb(err, false);
    }
  });
});

};
const insert = function ({
  model=model,
  docArray,
  cb = () => { } // eslint-disable-line
  }) {
  return new Promise((resolve, reject) => {

    model.insertMany(docArray,(err, data)=>{
      if (!err) {
        resolve(data);

        cb(false, data);
      } else {
        reject(err)
        cb(err, false);
      }
    })
  });
  
  };
const update = function (model,query, params,options={}, cb) {
model.update(query, {
  $setOnInsert: params
},options, (err, data) => {
  if (!err) {
    resolve(data);

    cb(false, data);
  } else {
    reject(err)
    cb(err, false);
  }
});
};

const count = function ({ model=model,params = {}, cb = () => { } }) { // eslint-disable-line
return new Promise((resolve, reject) => {
  model.count(params, (err, count) => { // eslint-disable-line
    if (!err) {
      resolve(count);
      cb(false, count);
    } else {
      reject(err);
      cb(err, false);
    }
  });
});
};

const remove = function (model,id) {
model.remove({
  _id: id
}, () => { }); // eslint-disable-line
};

const findOneAndUpdate = function ({
model=model,
query = {},
params = {},
cb = () => { } // eslint-disable-line
}) {
return new Promise((resolve, reject) => {
  model.findOneAndUpdate(query, params, {
    new: true
  }, (err, data) => {
    if (!err) {
      resolve(data);
      return cb(err, data);
    } else {
      reject(err);
      return cb(err, false);
    }
  });
});
};

const findByIdAndUpdate = ({
model=model,
id = '',
data = {},
options = {},
cb = () => { } // eslint-disable-line
}) => {
return new Promise((resolve, reject) => {
  model.findByIdAndUpdate(id, data, options, (err, result) => {
    if (!err) {
      resolve(result);
      return cb(err, result);
    } else {
      reject(err);
      return cb(err, false);
    }
  });
});
};


const aggregatePipeline = ({ model=model,match = {}, group = {}, cb = () => { } }) => {// eslint-disable-line
return new Promise((resolve, reject) => {
  model.aggregate([
    {
      $match: match
    },
    {
      $group: group
    }
  ]).exec((err, result) => {
    if (!err) {
      resolve(result);
      return cb(err, result);
    } else {
      reject(err);
      return cb(err, false);
    }
  });
});
};

const deleteSoft = ({model=model, params = {}, deletedBy, cb = () => { } }) => { // eslint-disable-line
return new Promise((resolve, reject) => {
  model.delete(params, deletedBy).exec((err, result) => {
    if (!err) {
      resolve(result);
      return cb(err, result);
    } else {
      reject(err);
      return cb(err, false);
    }
  });
});
};


const obj = {
find,
findOne,
findById,
create,
update,
count,
remove,
findOneAndUpdate,
findByIdAndUpdate,
aggregatePipeline,
deleteSoft,
insert
};

module.exports = obj;
