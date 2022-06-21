// import React from "react";
// import { useRouter } from "next/router";
import { Redirect } from "../../../utils/hardcoded";
import axios from "axios";
import { Tag } from "primereact/tag";

// import Head from "next/head";

function Store({ product }) {
  return (
    <>
      <div className="flex flex-wrap justify-content-evenly">
        <div>
          <img
            src={product.images[product.keyImage - 1].Location}
            alt={product.title}
            className="prodSlugImg"
          />
        </div>
        <div className="prodSlugSpecsSide">
          <p className="prodSlugTitle">{product.title}</p>
          <p className="prodSlugDesc">{product.description}</p>
          <p className="prodSlugPricing">
            <span>₹ {product.disCost}</span>
            <span>₹ {product.cost}</span>
            <span>35% OFF</span>
          </p>
          <div className="my-3 text-center">
            <Tag
              className="text-sm p-2"
              icon="pi pi-check"
              severity={
                product.inStock > 0
                  ? product.inStock <= 10
                    ? "info"
                    : "success"
                  : "warning"
              }
              value={
                product.inStock > 0
                  ? product.inStock <= 10
                    ? "Hurry! Only few left"
                    : "Available in Stock"
                  : "Out of Stock"
              }
            ></Tag>
          </div>
        </div>
      </div>
    </>
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
