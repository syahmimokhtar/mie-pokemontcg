"use client";
import React from "react";
import Image from "next/image";

const Card = ({ name, image, onClick }) => {
  const imgSrc = `${image}/high.png`;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:scale-110 hover:shadow-2xl cursor-pointer"
      onClick={onClick}
    >
      <Image
        priority
        width={300}
        height={300}
        src={imgSrc}
        alt={name}
        className="w-full h-auto"
        onError={(e) => {
          e.currentTarget.src = image;
        }}
      />
    </div>
  );
};

export default Card;
