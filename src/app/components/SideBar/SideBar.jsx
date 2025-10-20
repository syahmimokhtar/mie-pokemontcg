"use client";

import React from 'react'
import { useState , useEffect} from 'react';

const SideBar = ({isOpen, setIsOpen, search, setSearch}  ) => {


  return (
    <>
 <div
      className={`h-auto bg-[url(../../public/pokedex.jpg)] bg-cover shadow-md transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-12"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        {isOpen && <h2 className="text-lg font-bold text-black">Pokemon TCG</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="font-bold px-2 rounded-sm border  text-black "
        >
          {isOpen ? "<" : ">"}
        </button>
      </div>

      {/* Search Input */}
      {isOpen && (
        <div className="p-4">
          <h3 className="mb-4 font-bold text-black">Pokemon</h3>
          <input
            type="text"
            placeholder="Search Pokemon..."
             value={search}
            onChange={(e) => setSearch(e.target.value)}

            className="w-full bg-white px-3 py-2 text-sm text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      )}
    </div>
    </>

  )
}

export default SideBar;