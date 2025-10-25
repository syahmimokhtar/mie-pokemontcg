import React, { useState } from 'react'
import Image from 'next/image';

const Card = ({ name, image }) => {
  const [imgSrc, setImgSrc] = useState(`${image}/high.png`);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden   transition-transform duration-500  hover:-translate-y-2 hover:scale-110 hover:shadow-2xl cursor-pointer">
      <Image
      priority={true}
        width={1500}
        height={1500}
        src={imgSrc}
        alt={name}
        className="w-auto h-auto "
        onError={() => setImgSrc(image)} // fallback to base URL if /high.png fails
      />
   
    </div>
  );
};

export default Card;
