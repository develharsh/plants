import { useEffect, useState, useContext } from "react";
import { DataContext } from "../../store/globalstate";
import { ACTIONS } from "../../store/actions";
import { useRouter } from "next/router";
import axios from "axios";
import ProductCard from "../../components/store/ProductCard";
import Loading from "../../components/design/Loading";

function Kind() {
  const router = useRouter();
  const { dispatch, state } = useContext(DataContext);
  const { query, asPath } = router;
  const { kind } = query;
  const [data, setData] = useState({});
  useEffect(() => {
    if (kind) fetchProducts(kind, asPath, setData, router.push);
  }, [kind]);
  useEffect(() => {
    if (data.products) dispatch({ type: ACTIONS.LOADING, payload: false });
    else dispatch({ type: ACTIONS.LOADING, payload: true });
  }, [dispatch, data]);

  return (
    <>
      <div
        className={
          state.loading
            ? "flex align-items-center absolute h-screen w-full"
            : ""
        }
      >
        <Loading />
      </div>
      {data.products?.length == 0 && <h1>No Matchning products were found</h1>}
      <div className="flex flex-wrap justify-content-evenly row-gap-3 column-gap-1">
        {data.products?.map((each, idx) => (
          <ProductCard data={each} key={idx} />
        ))}
      </div>
    </>
  );
}

async function fetchProducts(kind, path, setData, redirect) {
  let queryParams = "";
  if (path.includes("?")) queryParams = "?" + path.split("?")[1];
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/product${queryParams}`,
      headers: {
        type: "get-by-filters",
        kind,
      },
    });
    console.log(response.data.data);
    setData(response.data.data);
  } catch (error) {
    console.log(error.response.data);
    redirect("/");
  }
}

export default Kind;
