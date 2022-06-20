import { Redirect, deleteCookies } from "../../../utils/hardcoded";
import axios from "axios";
import { useContext, useState } from "react";
import { DataContext } from "../../../store/globalstate";
import { ACTIONS } from "../../../store/actions";
import cookie from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";

function Plant({ categories, tags }) {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [values, setValues] = useState({
    title: "",
    keyImage: "",
    description: "",
    inStock: "",
    productId: "",
    disCost: "",
    cost: "",
    tags: [],
    category: "",
  });
  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  function handleSelect(value, key) {
    setValues({ ...values, [key]: value });
  }
  function handleFileChange(e) {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages([]);
    setPreviews([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          // console.log(reader.result)
          setPreviews((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  }
  function validation() {
    if (!values.title) return "Title is blank";
    if (images.length === 0) return "At least One Image is required";
    if (!values.keyImage) return "Main Image is blank";
    if (values.keyImage < 1 || images.length < values.keyImage)
      return "Main Image must be in the range 1-3";
    if (!values.description) return "Description is blank";
    if (!values.inStock) return "In Stock is blank";
    if (!values.cost) return "Cost without discount is blank";
    if (
      !values.disCost ||
      isNaN(Number(values.disCost)) ||
      Number(values.disCost) <= 0
    )
      return "Cost after discount is blank or invalid";

    if (!values.category) return "Please Select the category";
    if (values.tags.length == 0) return "At least One Tag is required";
  }
  async function handleSubmit() {
    const issue = validation();
    if (issue)
      return dispatch({
        type: ACTIONS.NOTIFY,
        payload: { bg: "error", message: issue },
      });
    dispatch({ type: ACTIONS.LOADING, payload: true });
    const myForm = new FormData();
    myForm.append("title", values.title);
    myForm.append("keyImage", values.keyImage);
    myForm.append("description", values.description);
    myForm.append("inStock", values.inStock);
    myForm.append("productId", values.productId);
    myForm.append("disCost", values.disCost);
    myForm.append("cost", values.cost);
    myForm.append("category", values.category);
    images.forEach((img) => myForm.append("images", img));
    values.tags.forEach((tag) => myForm.append("tags", tag));
    try {
      const token = cookie.get("token");
      const response = await axios({
        method: "POST",
        url: `${process.env.baseUrl}/api/s/product`,
        headers: {
          "x-access-token": token,
        },
        data: myForm,
      });
      dispatch({ type: ACTIONS.LOADING, payload: false });
      if (response.data.success) {
        // router.push("/s");
        dispatch({
          type: ACTIONS.NOTIFY,
          payload: { bg: "success", message: response.data.message },
        });
      }
    } catch (err) {
      dispatch({ type: ACTIONS.LOADING, payload: false });
      dispatch({
        type: ACTIONS.NOTIFY,
        payload: { bg: "error", message: err.response.data.message },
      });
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-evenly addPlant_main_div">
        <div>
          <img
            src="https://assets-news.housing.com/news/wp-content/uploads/2019/12/13172841/Rent-a-plant-service-An-easy-to-way-to-add-greenery-to-a-space-FB-1200x700-compressed.jpg"
            alt=""
            className="addplantTile"
          />
        </div>
        <div className="shadow-2xl rounded p-7 addPlant_input_div">
          <h1 className="mb-3 font-medium leading-tight text-2xl">
            Add new Plant
          </h1>
          <input
            type="text"
            className="mb-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
              "
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Title (Required)"
          />
          <label
            htmlFor="formFileMultiple"
            className="form-label mb-3 text-gray-700"
          >
            Add Upto 3 images
          </label>
          <input
            onChange={handleFileChange}
            className="form-control
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            type="file"
            id="formFileMultiple"
            accept="image/*"
            multiple
          />
          <Previews previews={previews} />
          <input
            type="number"
            className="mb-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            name="keyImage"
            value={values.keyImage}
            onChange={handleChange}
            placeholder="Main Image No., e.g. 2"
          />
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            className="
            form-control
            block
            w-full
            px-3
            py-1.5
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding
            border border-solid border-gray-300
            rounded
            transition
            ease-in-out
            m-0
            focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
          "
            rows="3"
            placeholder="Description (Required)"
          ></textarea>
        </div>
      </div>
      <div className="flex flex-wrap justify-evenly space-x-1 space-y-1 mx-5 shadow-2xl rounded p-7">
        <div>
          <input
            type="number"
            className="mb-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            name="inStock"
            value={values.inStock}
            onChange={handleChange}
            placeholder="Available Stock (Required)"
          />
        </div>
        <div>
          <input
            type="number"
            className="mb-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            name="cost"
            value={values.cost}
            onChange={handleChange}
            placeholder="Cost Without Discount (Required)"
          />
        </div>
        <div>
          <input
            type="number"
            className="mb-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            name="disCost"
            value={values.disCost}
            onChange={handleChange}
            placeholder="Cost After Discount (Required)"
          />
        </div>
        <div>
          <input
            type="text"
            className="mb-3 form-control  block  w-full  px-3  py-1.5  text-base  font-normal  text-gray-700  bg-white bg-clip-padding  border border-solid border-gray-300  rounded  transition  ease-in-out focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            name="productId"
            value={values.productId}
            onChange={handleChange}
            placeholder="Product Id (Optional)"
          />
        </div>
        <Categories categories={categories} handleSelect={handleSelect} />
        <Tags tags={tags} handleSelect={handleSelect} />
        <div>
          <button
            onClick={handleSubmit}
            type="button"
            className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            <span className="mr-1">
              <i className="fa-solid fa-plus"></i>
            </span>
            Add
          </button>
        </div>
      </div>
    </>
  );
}

function Tags({ tags, handleSelect }) {
  return (
    <div>
      <label htmlFor="plantTag" className="text-gray-400">
        Select Tags (At least 1)
      </label>
      <select
        onChange={(e) =>
          handleSelect(
            Array.from(e.target)
              .filter((option) => option.selected)
              .map((each) => each.value),
            "tags"
          )
        }
        id="plantTag"
        className="form-multiselect block w-full px-5 py-5 text-lg"
        multiple
      >
        {tags.map((each, idx) => (
          <option key={idx} value={each._id}>
            {each.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function Categories({ categories, handleSelect }) {
  return (
    <div>
      <select
        onChange={(e) => handleSelect(e.target.value, "category")}
        name="category"
        className="form-select appearance-none
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-300
        rounded
        transition
        ease-in-out
        my-3
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      >
        <option value="">*Category (Required)</option>
        {categories.map((each, idx) => (
          <option key={idx} value={each._id}>
            {each.title}
          </option>
        ))}
      </select>
    </div>
  );
}

function Previews({ previews }) {
  return (
    <>
      <div className="flex justify-center space-x-1 mb-3">
        {previews.map((each, idx) => (
          <img key={idx} src={each} alt="" className="addPlantPreviewImg" />
        ))}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const token = req.cookies.token;
  if (!token) return Redirect("/");
  if (token) {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.baseUrl}/api/auth/load-user`,
        headers: {
          "x-access-token": token,
        },
      });
      if (response.data.success && response.data.user.role === "Supplier") {
      } else return Redirect("/");
    } catch (err) {
      res.setHeader(...deleteCookies(["token"]));
      return Redirect("/");
    }
  }
  let categories;
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/a/category?type=plants`,
    });
    if (response.data.success) {
      categories = response.data.categories;
    } else return Redirect("/s");
  } catch (err) {
    return Redirect("/s");
  }

  let tags;
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/a/tag?type=plants`,
    });
    if (response.data.success) {
      tags = response.data.tags;
    } else return Redirect("/s");
  } catch (err) {
    return Redirect("/s");
  }

  return { props: { tags, categories } };
}

export default Plant;
