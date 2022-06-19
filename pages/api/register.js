import connectDB from "../../utils/connectDB";
import User from "../../models/user.model";
import errorResponse from "../../utils/errorResponse";

connectDB();

export default async function Register(req, res) {
  try {
    // debugger;
    const user = await User.create({ ...req.body, role: "Client" });
    const token = user.getJWTToken();
    res
      .status(200)
      .json({ success: true, message: "Registered Successfully", token, user });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Client Register Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}
