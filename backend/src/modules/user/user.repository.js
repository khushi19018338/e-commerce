const User = require("./user.model");
const createUser =(data) => User.create(data);
const findByEmail =(email) => User.findOne({email});
const findById =(id) =>User.findById(id);
module.exports={
    createUser,
    findByEmail,
    findById
};