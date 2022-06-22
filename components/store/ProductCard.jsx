// import React from 'react'
import Link from "next/link";

function ProductCard({ data }) {
  return (
    <Link href={`/store/plants/${data.slug}`}>
      <a className="prodCardMainDiv shadow-2">
        <img
          src={data.images[data.keyImage - 1].Location}
          alt={data.title}
          className="prodCardImg"
        />
        <p className="mx-1 mb-2 prodCardTitle">{data.title}</p>
        <p className="prodCardPricing mb-2">
          <span>₹ {data.disCost}</span>
          <span>₹ {data.cost}</span>
          <span>{Math.ceil(100 - (data.disCost * 100) / data.cost)}% OFF</span>
        </p>
      </a>
    </Link>
  );
}

export default ProductCard;
