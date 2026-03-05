const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("./user.repository");

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Only allow ADMIN role if already authenticated admin
  const safeRole = role === "ADMIN" ? "ADMIN" : "USER";

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role: safeRole
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};
const loginUser = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};
