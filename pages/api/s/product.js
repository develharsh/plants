import connectDB from "../../../utils/connectDB";
import Plant from "../../../models/plant.model";
import errorResponse from "../../../utils/errorResponse";
import { isAuthenticated } from "../../../middlewares/auth";
import formidable from "formidable";
import { saveImages, deleteImages } from "../../../utils/s3";

connectDB();

export default function Index(req, res) {
  switch (req.method) {
    case "GET":
      //   await getTags(req, res);
      break;
    case "PUT":
      break;
    case "POST":
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          res.writeHead(err.httpCode || 400, { "Content-Type": "text/plain" });
          return res.status(500).json({ success: false, message: String(err) });
        }
        (req.body = fields), (req.files = files);
        await createPlant(req, res);
      });

      break;
    case "DELETE":
      break;
  }
}

async function createPlant(req, res) {
  let reshaped = {
    images: [],
    avgRating: 0,
    tags: [],
  };
  try {
    const response = await isAuthenticated(req.headers["x-access-token"]);
    // console.log("RESPONSE", response);
    if (response.success) reshaped.postedBy = response.user._id;
    else throw response;
    if (req.body.title) reshaped.title = req.body.title;
    if (req.body.keyImage) reshaped.keyImage = req.body.keyImage;
    if (req.body.description) reshaped.description = req.body.description;
    if (req.body.inStock) reshaped.inStock = req.body.inStock;
    if (req.body.productId) reshaped.productId = req.body.productId;
    if (req.body.disCost) reshaped.disCost = req.body.disCost;
    if (req.body.cost) reshaped.cost = req.body.cost;
    if (req.body.category) reshaped.category = req.body.category;
    if (!req.body.images) throw { message: "Images Are Missing" };
    if (req.body.images.length == 0)
      throw { message: "At least One image must be choosen" };
    if (!req.body.tags) throw { message: "At least One Tag is required" };
    if (req.body.tags.length == 0)
      throw { message: "At least One Tag must be choosen" };

    if (typeof req.body.images === "string") {
      //single image
      reshaped.images.push(req.body.images);
    } else {
      reshaped.images = req.body.images;
    }
    if (typeof req.body.tags === "string") {
      //single image
      reshaped.tags.push(req.body.tags);
    } else {
      reshaped.tags = req.body.tags;
    }

    reshaped.slug = reshaped.title;

    reshaped.images = await saveImages(
      req.body.images,
      reshaped.title,
      "plants"
    );
    const plant = await Plant.create(reshaped);
    // console.log("Reshaped", reshaped);
    // throw { message: "Dhuan" };

    res.status(200).json({
      success: true,
      message: "Plant was added successfully",
      plant,
    });
  } catch (error) {
    //delete images now, as some error occured
    deleteImages(reshaped.images);
    const response = errorResponse(error);
    console.log("Plant Add Error", error);
    res
      .status(response.code)
      .json({ success: false, message: response.message });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
