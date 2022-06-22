const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
exports.get = (
  keyword,
  category,
  tags,
  low,
  high,
  page,
  sortBy,
  productsPerPage,
  type,
  exclude
) => {
  //
  let matchObj = {},
    sortObj = {};
  let pipeline = [{ $match: matchObj }];
  if (keyword) matchObj.title = { $regex: keyword, $options: "i" };
  if (category) matchObj.category = ObjectId(category);
  if (tags) {
    tags = tags
      .replace("[", "")
      .replace("]", "")
      .split(",")
      .filter((each) => each);
    if (tags.length) {
      matchObj.tags = {
        $in: tags,
      };
    }
  }
  if (low || high) {
    matchObj.disCost = {};
    if (low) matchObj.disCost.$gte = Number(low);
    if (high) matchObj.disCost.$lte = Number(high);
  }
  if (sortBy) {
    pipeline.push({ $sort: sortObj });
    if (sortBy == "latest") {
      sortObj.createdAt = -1;
    } else if (sortBy == "default") {
      pipeline.pop();
    } else if (sortBy == "low-high") {
      sortObj.disCost = 1;
    } else if (sortBy == "high-low") {
      sortObj.disCost = -1;
    } else pipeline.pop();
  }
  //Reusability Start
  if (type == "similar") {
    pipeline = [
      {
        $match: {
          _id: { $ne: ObjectId(exclude) },
          category: ObjectId(category),
          //   subcategory: ObjectId(subcategory),
        },
      },
      { $sample: { size: productsPerPage } },
    ];
  }
  //Reusability End
  pipeline.push(
    {
      $facet: {
        beforePaginate: [
          {
            $count: "count",
          },
        ],
        afterPaginate: [
          {
            $skip: productsPerPage * (Number(page) - 1),
          },
          {
            $limit: productsPerPage,
          },
        ],
      },
    },
    {
      $unwind: "$beforePaginate",
    }
  );
  return pipeline;
};
