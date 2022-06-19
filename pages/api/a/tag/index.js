import connectDB from "../../../../utils/connectDB";
import Tag from "../../../../models/tag.model";
import errorResponse from "../../../../utils/errorResponse";

connectDB();

export default async function Index(req, res) {
  switch (req.method) {
    case "GET":
      await getTags(req, res);
      break;
    case "PUT":
      break;
    case "POST":
      await createTag(req, res);
      break;
    case "DELETE":
      break;
  }
}

async function getTags(req, res) {
  try {
    let filter = {};
    if (req.query.type) filter.kind = req.query.type;
    const tags = await Tag.find(filter);
    res.status(200).json({
      success: true,
      tags,
    });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Tag Get Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}

async function createTag(req, res) {
  try {
    const tag = await Tag.create(req.body);
    res.status(200).json({
      success: true,
      message: "Tag was added successfully",
      tag,
    });
  } catch (error) {
    const response = errorResponse(error);
    console.log("Tag Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}
