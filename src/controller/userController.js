import userService from "../services/userService.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);
    const response = [
      {
        message: "Register Successfully",
        data: result,
      },
    ];
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  register,
};