"use client";

import React from 'react'
import { useState , useEffect} from 'react';
import axios from 'axios';
import dynamic from "next/dynamic";


const Select = dynamic(() => import("react-select"), { ssr: false });

const SideBar = ({isOpen, setIsOpen, search, setSearch}  ) => {


const [isLoading, setIsLoading] = useState(false);
const [set, setSets]=useState([]);
const [series, setSeries]=useState([]);

  
const options = [
  { id: 1, value: "chocolate", label: "Chocolate" },
  { id: 2, value: "strawberry", label: "Strawberry" },
  { id: 3, value: "vanilla", label: "Vanilla" },
];


const fetchSets = async () => {
    setIsLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      let url = "https://api.tcgdex.net/v2/en/sets/";

      // if (search.trim() === "") {
      //   // no search → use paginated API
      //   url = `https://api.tcgdex.net/v2/en/cards?pagination:page=${pageNumber}&pagination:itemsPerPage=${itemsPerPage}`;
      // } else {
      //   // search → use search API
      //   url = `https://api.tcgdex.net/v2/en/cards?name=${search}`;
      // }

      const response = await axios.get(url, { headers });

     
      const formattedSets = response.data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setSets(formattedSets);


      

    } catch (error) {
      console.log("Error fetching cards", error);
    } finally {
      setIsLoading(false);
    }
  };

const fetchSeries = async () => {
    setIsLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      let url = "https://api.tcgdex.net/v2/en/series/";

      const response = await axios.get(url, { headers });

    
      const formattedSets = response.data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setSeries(formattedSets);


      

    } catch (error) {
      console.log("Error fetching series", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  
    useEffect(() => {
      fetchSets();
      fetchSeries();
    }, []);




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


      {isOpen && (

        <div className="p-4">
          <h3 className="mb-4 font-bold text-black">Sets</h3>
          <Select
            instanceId="set-select"
            options={set}
            isLoading={isLoading}
            placeholder="Select a set..."
            className="text-black"
          />
       </div>
      )}

      {isOpen && (
        <div className="p-4">
          <h3 className="mb-4 font-bold text-black">Series</h3>
          <Select
            instanceId="set-select"
            options={series}
            isLoading={isLoading}
            placeholder="Select a set..."
            className="text-black"
          />
       </div>
      )}

    </div>
    </>

  )
}

export default SideBar;