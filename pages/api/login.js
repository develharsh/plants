import connectDB from "../../utils/connectDB";
import User from "../../models/user.model";
import bcrypt from "bcryptjs";

connectDB();

export default async function Login(req, res) {
  let { phone, password } = req.body;
  try {
    // debugger;
    if (!phone) throw { message: "Phone is missing" };
    if (!password) throw { message: "Password is missing" };
    const user = await User.findOne({ phone }).select("+password");
    if (!user) throw { message: "No such user found" };
    // throw {message:"io"} 
    const doMatch = await user.comparePassword(password);
    // console.log(password, user.password)
    if (!doMatch) throw { message: "No such user found" };
    const token = user.getJWTToken();
    res
      .status(200)
      .json({ success: true, message: "Logged In Successfully", token, user });
  } catch (err) {
    console.log("Log In API Error", err);
    res.status(500).json({ success: false, message: err.message });
  }
}
