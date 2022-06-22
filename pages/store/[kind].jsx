import { useEffect, useState, useContext } from "react";
import { DataContext } from "../../store/globalstate";
import { ACTIONS } from "../../store/actions";
import { useRouter } from "next/router";
import axios from "axios";
import ProductCard from "../../components/store/ProductCard";
import Loading from "../../components/design/Loading";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";

function Kind() {
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);
  const { query, asPath } = router;
  const { kind } = query;
  const [data, setData] = useState({});
  const { products } = data;
  const [essen, setEssentials] = useState({});
  const { categories, tags } = essen;
  const [selected, setSelected] = useState({
    tags: [],
    tagObjs: [],
    category: "",
    categoryLabel: null,
  });
  const [values, setValues] = useState({ keyword: "" });

  useEffect(() => {
    if (kind) {
      fetchProducts(kind, asPath, setData, router.push);
      fetchEssentials(kind).then((data) => setEssentials(data));
    }
  }, [kind]);

  useEffect(() => {
    if (products) {
      console.log("Products", products);
      dispatch({ type: ACTIONS.LOADING, payload: false });
    } else dispatch({ type: ACTIONS.LOADING, payload: true });
  }, [dispatch, products]);

  useEffect(() => {
    if (tags) {
      console.log("tags", tags);
      // setEssentials({ ...essen, tags });
    }
  }, [dispatch, tags, categories]);

  useEffect(() => {
    if (categories) {
      console.log("categories", categories);
      // setEssentials({ ...essen, categories });
    }
  }, [dispatch, categories]);

  function handleFilter() {
    let query = "?";
    for (const [key, value] of Object.entries({
      ...values,
      tags: selected.tags,
      category: selected.category,
    })) {
      query += `${key}=${value}&`;
    }
    fetchProducts(kind, query, setData, router.push);
    router.push(`/store/${kind}${query}`);
  }

  function handleChange(key, value) {
    setValues({ ...values, [key]: value });
  }

  function handleSelect(value, key) {
    let newState = { ...selected };
    if (key === "category") {
      newState.category = value._id;
      newState.categoryLabel = value;
      handleChange(key, value._id);
    } else {
      newState.tagObjs = value;
      newState.tags = value.map((each) => each._id);
    }
    setSelected(newState);
    setTimeout(() => {
      handleFilter();
    }, 2000);
  }

  return (
    <>
      <Loader loading={state.loading} />
      <Accordion>
        <AccordionTab header="Filters">
          <div className="flex flex-wrap justify-content-evenly column-gap-1 row-gap-2">
            <div className="col-12 md:col-4">
              <div className="p-inputgroup">
                <InputText
                  placeholder="Search"
                  name="search"
                  value={values.keyword}
                  onChange={(e) => handleChange("keyword", e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFilter()}
                />
                <Button
                  onClick={handleFilter}
                  icon="pi pi-search"
                  className="p-button-warning"
                />
              </div>
            </div>
            {categories?.length && (
              <div>
                <label
                  htmlFor="category"
                  className="block text-900 font-medium mb-2"
                >
                  Select a Category
                </label>
                <Categories
                  categories={categories}
                  values={selected}
                  handleSelect={handleSelect}
                />
              </div>
            )}
            {tags?.length && (
              <div>
                <label
                  htmlFor="tag"
                  className="block text-900 font-medium mb-2"
                >
                  Select Tags
                </label>
                <Tags
                  tags={tags}
                  values={selected}
                  handleSelect={handleSelect}
                />
              </div>
            )}
          </div>
        </AccordionTab>
      </Accordion>
      {products?.length == 0 && <h1>No Matching products were found</h1>}
      <div className="flex flex-wrap justify-content-evenly row-gap-3 column-gap-1">
        {data.products?.map((each, idx) => (
          <ProductCard data={each} key={idx} />
        ))}
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

function Loader({ loading }) {
  return (
    <div
      className={
        loading ? "flex align-items-center absolute h-screen w-full" : ""
      }
    >
      <Loading />
    </div>
  );
}

async function fetchProducts(kind, path, setData, redirect) {
  let queryParams = "";
  if (path.includes("?")) queryParams = "?" + path.split("?")[1];
  alert(queryParams);
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/product${queryParams}`,
      headers: {
        type: "get-by-filters",
        kind,
      },
    });
    // console.log(response.data.data);
    setData(response.data.data);
  } catch (error) {
    console.log(error.response.data);
    redirect("/");
  }
}

async function fetchEssentials(kind) {
  let categories, tags;
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/a/category?type=${kind}`,
    });
    categories = response.data.categories;
  } catch (err) {}

  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/a/tag?type=${kind}`,
    });
    tags = response.data.tags;
  } catch (err) {}
  return { categories, tags };
}

export default Kind;
