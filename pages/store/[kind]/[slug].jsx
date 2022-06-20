// import React from "react";
// import { useRouter } from "next/router";
import { Redirect } from "../../../utils/hardcoded";
import axios from "axios";

function Store({ product }) {
  return (
    <div>
      <img
        src={product.images[product.keyImage - 1].Location}
        alt=""
        style={{ width: "300px" }}
      />
      {product.title}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const url = req.url.replace("/store/", "").split("/");
  const kind = url[0],
    slug = url[1];
  let product;
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/product?kind=${kind}&slug=${slug}`,
    });
    product = response.data.product;
  } catch (err) {
    return Redirect("/");
  }

  return { props: { product } };
}

export default Store;
