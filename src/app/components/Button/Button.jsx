import React from 'react'

const Button = ({onClick, disabled, isLoading,label, variant }) => {

      const baseStyle =
    "w-full py-2 px-4 rounded-md font-semibold transition disabled:opacity-50 mb-4 ";

  // ✅ Variant styles
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };


  return (
    <button
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]}`}
        >
            {isLoading ? "Loading..." : label}
        </button>

  )
}

export default Button