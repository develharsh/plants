import connectDB from "../../../utils/connectDB";
import User from "../../../models/user.model";
import UserData from "../../../models/user.data.model";
import errorResponse from "../../../utils/errorResponse";

connectDB();

export default async function Register(req, res) {
  let user;
  try {
    // debugger;
    const { company, state, city, address, email, phone, password } = req.body;
    if (!company) throw { message: "Name of Company/Business is missing" };
    if (!state) throw { message: "State is missing" };
    if (!city) throw { message: "City is missing" };
    if (!address) throw { message: "Address is missing" };
    user = await User.create({ phone, password, role: "Supplier" });
    await UserData.create({
      company,
      address: { state, city, address },
      email,
      user: user._id,
    });
    const token = user.getJWTToken();
    res
      .status(200)
      .json({ success: true, message: "Registered Successfully", token, user });
  } catch (error) {
    user?.remove();
    const response = errorResponse(error);
    console.log("Supplier Register Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}
