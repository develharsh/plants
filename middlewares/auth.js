import User from "../models/user.model";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (token) => {
  try {
    // console.log("C", token);
    if (token) {
      return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async function (err, decoded) {
          if (err) {
            if (err.name == "TokenExpiredError")
              throw new Error("Session Expired, Please Login Again.");
            throw new Error("Invalid Token Provided, Please Log In Again.");
          }
          let user = await User.findById(decoded._id);
          if (!user) throw new Error("Session Expired, Please Login Again.");
          return { success: true, user };
        }
      );
    }
    throw new Error("Please Log In, To Access This Resource.");
  } catch (err) {
    const { message } = err;
    return { success: false, message };
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role))
        throw new Error("You are not authorized to access this resource");
      return next();
    } catch (err) {
      const { message } = err;
      return res.status(403).json({ success: false, message });
    }
  };
};
