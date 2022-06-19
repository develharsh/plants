import connectDB from "../../../../utils/connectDB";
import Category from "../../../../models/category.model";
import errorResponse from "../../../../utils/errorResponse";

connectDB();

export default async function Index(req, res) {
  switch (req.method) {
    case "GET":
      await getCategories(req, res);
      break;
    case "PUT":
      break;
    case "POST":
      await createCategory(req, res);
      break;
    case "DELETE":
      break;
  }
}
async function getCategories(req, res) {
  try {
    let filter = {};
    if (req.query.type) filter.kind = req.query.type;
    const categories = await Category.find(filter);
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Category Get Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}

async function createCategory(req, res) {
  try {
    const category = await Category.create(req.body);
    res.status(200).json({
      success: true,
      message: "Category was added successfully",
      category,
    });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Category Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}
