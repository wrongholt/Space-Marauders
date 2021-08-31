var _ = require("lodash");
const data = require("./inventory");
const theFunc = async () => {
  var inventory = await data.getAllTheStuff();
};

theFunc();
