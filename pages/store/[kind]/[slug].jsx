import { useState } from "react";
// import { useRouter } from "next/router";
import { Redirect } from "../../../utils/hardcoded";
import axios from "axios";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import $ from "jquery";

// import Head from "next/head";

function Store({ product }) {
  const [item, setItem] = useState({ quantity: 1 });
  const [selectedImg, setSelectedImg] = useState(product.keyImage);
  return (
    <>
      <div className="flex flex-wrap justify-content-evenly">
        <div>
          <div>
            <img
              id="prodSlugImg"
              src={product.images[selectedImg - 1].Location}
              alt={product.title}
              className="prodSlugImg"
            />
          </div>
          <ImagesNavigate
            setSelectedImg={setSelectedImg}
            images={product.images}
            selectedImg={selectedImg}
          />
        </div>
        <div className="prodSlugSpecsSide">
          <p className="prodSlugTitle">{product.title}</p>
          <p className="prodSlugDesc">{product.description}</p>
          <p className="prodSlugPricing">
            <span>₹ {product.disCost}</span>
            <span>₹ {product.cost}</span>
            <span>
              {Math.ceil(100 - (product.disCost * 100) / product.cost)}% OFF
            </span>
          </p>
          <div className="mt-3 mb-3 text-center">
            <Tag
              className="text-sm p-2"
              icon={getTagIcon(product.inStock)}
              severity={getTagSeverity(product.inStock)}
              value={getTagValue(product.inStock)}
            ></Tag>
          </div>
          <div className="mb-3 text-center">
            <InputNumber
              disabled={product.inStock == 0}
              inputId="horizontal"
              value={item.quantity}
              onValueChange={(e) => setItem({ ...item, quantity: e.value })}
              showButtons
              buttonLayout="horizontal"
              // step={0.25}
              decrementButtonClassName="p-button-secondary p-button-outlined"
              incrementButtonClassName="p-button-secondary p-button-outlined"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              min={1}
              // style={{ width: "10rem !important" }}
              // mode="currency"
              // currency="INR"
            />
          </div>
          <div className="mb-3 text-center">
            <Button
              disabled={!item.quantity || product.inStock == 0}
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              className="p-button-help prodSlugAddtoCartBtn"
              onClick={() => alert(item.quantity)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function ImagesNavigate({ images, selectedImg, setSelectedImg }) {
  return (
    <div className="flex justify-content-evenly">
      {images.map((each, idx) => (
        <img
          src={each.Location}
          alt="..."
          key={idx}
          onClick={() => {
            $("#prodSlugImg").fadeOut();
            $("#prodSlugImg").fadeIn();
            setTimeout(() => {
              setSelectedImg(idx + 1);
            }, 400);
          }}
          className={`${
            selectedImg - 1 == idx ? "prodSlugImgActive " : ""
          }prodSlugImgNavigate cursor-pointer`}
        />
      ))}
    </div>
  );
}

function getTagIcon(value) {
  return value > 0
    ? value <= 10
      ? "pi pi-info-circle"
      : "pi pi-check"
    : "pi pi-exclamation-triangle";
}

function getTagSeverity(value) {
  return value > 0 ? (value <= 10 ? "info" : "success") : "warning";
}

function getTagValue(value) {
  return value > 0
    ? value <= 10
      ? "Hurry! Only few left"
      : "Available in Stock"
    : "Out of Stock";
}

export async function getServerSideProps(context) {
  const { kind, slug } = context.params;
  let product;
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.baseUrl}/api/product?kind=${kind}&slug=${slug}`,
      headers: {
        type: "get-by-slug",
      },
    });
    product = response.data.product;
  } catch (err) {
    return Redirect("/");
  }

  return { props: { product } };
}

export default Store;
