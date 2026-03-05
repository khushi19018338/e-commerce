import API from "../../../config/axios";

export const registerUser = (data) =>
  API.post("/users/register", {
    ...data,
    role: "USER"
  });

export const registerAdmin = (data) =>
  API.post("/users/register", {
    ...data,
    role: "ADMIN"
  });

export const loginUser = (data) =>
  API.post("/users/login", data);

export const getProfile = () =>
  API.get("/users/profile");