"use client";
import React, { useEffect } from "react";
import Image from "next/image";

const Modal = ({ isOpen, onClose, title, imageSrc, alt }) => {
  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-md p-4 max-w-3xl w-full transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-lg"
        >
          &times;
        </button>

        {/* Title */}
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

        {/* Image */}
        {imageSrc && (
          <div className="flex justify-center">
            <Image
              src={imageSrc}
              alt={alt || title}
              width={800}
              height={800}
              className="object-contain max-h-[80vh]"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
