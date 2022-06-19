import connectDB from "../../../utils/connectDB";
import { isAuthenticated } from "../../../middlewares/auth";

connectDB();

export default async function LoadUser(req, res) {
  try {
    const data = await isAuthenticated(req.headers["x-access-token"]);
    if (!data.success) throw { message: data.message };
    res.status(200).json({ success: true, user: data.user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}