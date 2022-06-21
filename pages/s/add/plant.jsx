import { Redirect, deleteCookies } from "../../../utils/hardcoded";
import axios from "axios";
import { useContext, useState } from "react";
import { DataContext } from "../../../store/globalstate";
import { ACTIONS } from "../../../store/actions";
import cookie from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
// import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

function Plant({ categories, tags }) {
  const router = useRouter();
  const { dispatch } = useContext(DataContext);
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
    tagObjs: [],
    category: "",
    categoryLabel: null,
  });
  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  function handleSelect(value, key) {
    let newState = { ...values };
    if (key === "category") {
      newState.category = value._id;
      newState.categoryLabel = value;
    } else {
      newState.tagObjs = value;
      newState.tags = value.map((each) => each._id);
    }
    setValues(newState);
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
    if (!values.inStock || values.inStock <= 0)
      return "In Stock is blank or invalid";
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
    delete values.categoryLabel;
    delete values.tagObjs;
    const issue = validation();
    if (issue)
      return dispatch({
        type: ACTIONS.NOTIFY,
        payload: ["error", issue],
      });
    dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: true });
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
        url: `${process.env.baseUrl}/api/product`,
        headers: {
          "x-access-token": token,
        },
        data: myForm,
      });
      dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: false });
      if (response.data.success) {
        router.push("/s");
        dispatch({
          type: ACTIONS.NOTIFY,
          payload: ["success", response.data.message],
        });
      }
    } catch (err) {
      dispatch({ type: ACTIONS.GLOBAL_LOADING, payload: false });
      dispatch({
        type: ACTIONS.NOTIFY,
        payload: ["error", err.response.data.message],
      });
    }
  }

  return (
    <>
      <div className="flex flex-wrap justify-content-evenly addPlant_main_div">
        <div>
          <img
            src="https://assets-news.housing.com/news/wp-content/uploads/2019/12/13172841/Rent-a-plant-service-An-easy-to-way-to-add-greenery-to-a-space-FB-1200x700-compressed.jpg"
            alt=""
            className="addplantTile"
          />
        </div>
        <div className="shadow-2 border-round p-5 addPlant_input_div">
          <h1 className="mb-3 font-medium text-2xl">Add new Plant</h1>
          <label htmlFor="title" className="block text-900 font-medium mb-2">
            Title
          </label>
          <InputText
            name="title"
            value={values.title}
            onChange={handleChange}
            id="title"
            type="text"
            className="w-full mb-3"
            placeholder="Required"
          />
          <label
            htmlFor="formFileMultiple"
            className="form-label mb-3 text-gray-700"
          >
            Add Upto 3 images
          </label>
          <input
            onChange={handleFileChange}
            className="block mt-2 mb-1 text-lg max-w-16rem"
            type="file"
            id="formFileMultiple"
            accept="image/*"
            multiple
          />
          <Previews previews={previews} />
          <label htmlFor="keyImage" className="block text-900 font-medium">
            Main Image
          </label>
          <InputText
            name="keyImage"
            value={values.keyImage}
            onChange={handleChange}
            id="keyImage"
            type="number"
            className="w-full mb-3"
            placeholder="Required"
          />
          <label
            htmlFor="description"
            className="block text-900 font-medium mb-2"
          >
            Description
          </label>
          <InputTextarea
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={3}
            className="w-full"
            placeholder="Required"
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-content-evenly column-gap-1 row-gap-1 mx-5 my-3 shadow-3 border-round p-7">
        <div>
          <label htmlFor="inStock" className="block text-900 font-medium mb-2">
            Available Stock
          </label>
          <InputText
            name="inStock"
            value={values.inStock}
            onChange={handleChange}
            id="inStock"
            type="number"
            className="w-full mb-3"
            placeholder="Required"
          />
        </div>
        <div>
          <label htmlFor="cost" className="block text-900 font-medium mb-2">
            Cost without Discount
          </label>
          <InputText
            name="cost"
            value={values.cost}
            onChange={handleChange}
            id="cost"
            type="number"
            className="w-full mb-3"
            placeholder="Required"
          />
        </div>
        <div>
          <label htmlFor="disCost" className="block text-900 font-medium mb-2">
            Cost after Discount
          </label>
          <InputText
            name="disCost"
            value={values.disCost}
            onChange={handleChange}
            id="disCost"
            type="number"
            className="w-full mb-3"
            placeholder="Required"
          />
        </div>
        <div>
          <label htmlFor="disCost" className="block text-900 font-medium mb-2">
            Unique Product Id(only visible to you)
          </label>
          <InputText
            name="productId"
            value={values.productId}
            onChange={handleChange}
            id="productId"
            type="text"
            className="w-full mb-3"
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-900 font-medium mb-2">
            Select a Category
          </label>
          <Categories
            categories={categories}
            values={values}
            handleSelect={handleSelect}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="tags" className="block text-900 font-medium mb-2">
            {values.tags.length
              ? `${values.tags.length} tags selected`
              : "Select Tags (minimum 1)"}
          </label>
          <Tags tags={tags} values={values} handleSelect={handleSelect} />
        </div>
        <div className="flex flex-wrap justify-content-evenly row-gap-2 column-gap-2">
          <div>
            <Button icon="pi pi-check" label="Add" onClick={handleSubmit} />
          </div>
          <div className="mt-3">
            <Link href="/s">
              <a className="px-5 border-round text-white no-underline text-base font-bold py-3 bg-red-500">
                <span>
                  <i className="pi pi-times"></i>
                </span>{" "}
                Cancel
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function Tags({ values, tags, handleSelect }) {
  return (
    <MultiSelect
      value={values.tagObjs}
      options={tags}
      onChange={(e) => handleSelect(e.target.value, "tags")}
      optionLabel="title"
      placeholder="Select Tags"
      className="max-w-18rem"
    />
  );
}

function Categories({ values, categories, handleSelect }) {
  return (
    <Dropdown
      value={values.categoryLabel}
      options={categories}
      onChange={(e) => handleSelect(e.target.value, "category")}
      optionLabel="title"
      filter
      filterBy="title"
      placeholder="Select a Category"
      className="w-full"
      // valueTemplate={selectedCountryTemplate}
      // itemTemplate={countryOptionTemplate}
    />
  );
}

function Previews({ previews }) {
  return (
    <>
      <div className="flex justify-content-evenly mb-3">
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
