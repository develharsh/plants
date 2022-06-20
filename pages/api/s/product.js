import connectDB from "../../../utils/connectDB";
import Plant from "../../../models/plant.model";
import errorResponse from "../../../utils/errorResponse";
import { isAuthenticated } from "../../../middlewares/auth";

import fs from "fs";

import multiparty from "multiparty"; //for parsing

connectDB();

async function saveImages(images, title) {
  return new Promise((resolve) => {
    let links = [];
    images.forEach((img) => {
      const data = img.replace(/^data:image\/\w+;base64,/, "");
      const ext = img.split(";base64")[0].replace("data:image/", "");
      const name = title.replace(/\s+/, "_").slice(0, 20);
      const buf = Buffer.from(data, "base64");

      let saved = false,
        fileNumber = 1;
      while (!saved) {
        const fileNumber_str = fileNumber.toString();
        const current = `${name}_${Date.now()}_${getRandomIntInclusive(
          1,
          100
        )}_${fileNumber_str}.${ext}`;
        // const current = `${name}_1655674196913_${fileNumber_str}.${ext}`;
        console.log(current);
        if (fs.existsSync(`./public/assets/plants/${current}`)) {
          ++fileNumber;
        } else {
          fs.writeFile(`./public/assets/plants/${current}`, buf, () => {});
          saved = true;
          links.push(`/plants/${current}`);
        }
      }
    });
    resolve(links);
  });
}

function deleteImages(images) {
  images.forEach((path) => fs.unlinkSync(`./public/assets${path}`));
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export default async function Index(req, res) {
  switch (req.method) {
    case "GET":
      //   await getTags(req, res);
      break;
    case "PUT":
      break;
    case "POST":
      const form = new multiparty.Form();
      const data = await new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
          if (err) reject({ err });
          resolve({ fields, files });
        });
      });
      // console.log(data);
      req.body = data.fields;
      // req.files = data.files;
      await createPlant(req, res);
      break;
    case "DELETE":
      break;
  }
}

async function createPlant(req, res) {
  let reshaped = {
    images: [],
    // postedBy: req.,
    avgRating: 0,
  };
  try {
    const response = await isAuthenticated(req.headers["x-access-token"]);
    // console.log("RESPONSE", response);
    if (response.success) reshaped.postedBy = response.user._id;
    else throw response;
    if (req.body.title?.length) reshaped.title = req.body.title[0];
    if (req.body.keyImage?.length) reshaped.keyImage = req.body.keyImage[0];
    if (req.body.description?.length)
      reshaped.description = req.body.description[0];
    if (req.body.inStock?.length) reshaped.inStock = req.body.inStock[0];
    if (req.body.productId?.length) reshaped.productId = req.body.productId[0];
    if (req.body.disCost?.length) reshaped.disCost = req.body.disCost[0];
    if (req.body.cost?.length) reshaped.cost = req.body.cost[0];
    if (req.body.category?.length) reshaped.category = req.body.category[0];
    if (req.body.tags.length == 0)
      throw { message: "At least One Tag is required" };
    reshaped.tags = req.body.tags;
    reshaped.slug = reshaped.title;
    reshaped.images = await saveImages(req.body.images, reshaped.title);
    const plant = await Plant.create(reshaped);

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
