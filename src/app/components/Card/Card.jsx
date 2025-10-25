"use client";
import React, { useState } from "react";
import Image from "next/image";
import Modal from "../Modal/Modal";

const Card = ({ name, image }) => {
  const [imgSrc, setImgSrc] = useState(`${image}/high.png`);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-500 hover:-translate-y-2 hover:scale-110 hover:shadow-2xl cursor-pointer"
      onClick={() => setIsModalOpen(true)}
    >
      <Image
        priority={true}
        width={1500}
        height={1500}
        src={imgSrc}
        alt={name}
        className="w-auto h-auto"
        onError={() => setImgSrc(image)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={name}
        imageSrc={imgSrc}
        alt={name}
      />
    </div>
  );
};

export default Card;
