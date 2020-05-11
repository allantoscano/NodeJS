const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");

exports.authenticate = async (data) => {
  const res = await Customer.findOne({
    email: data.email,
    password: data.password,
  });

  return res;
};

exports.get = async () => {
  const res = await Customer.find({}, "name email password");

  return res;
};

exports.create = async (data) => {
  const customer = new Customer(data);

  await customer.save();
};
