const userService = require("./user.service");

const register = async (req, res, next) => {
  try {
    const result = await userService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json(result);
    console.log("user registered")
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
