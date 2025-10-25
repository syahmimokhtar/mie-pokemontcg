"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import Button from "../Button/Button";


const Select = dynamic(() => import("react-select"), { ssr: false });

const SideBar = ({ isOpen, setIsOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [series, setSeries] = useState([]);
  const [sets, setSets] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [localSearch, setLocalSearch] = useState("");

  // ✅ Fetch all Pokémon TCG series
  const fetchSeries = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://api.tcgdex.net/v2/en/series/");
      const formatted = res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      setSeries(formatted);
    } catch (err) {
      console.error("Error fetching series", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ When user selects a series → fetch its sets
  const handleSeriesChange = async (option) => {
    setSelectedSeries(option);
    setSelectedSet(null);
    setIsLoading(true);
    setIsDisabled(true);
    setLocalSearch("")

    try {
      const res = await axios.get(
        `https://api.tcgdex.net/v2/en/series/${option.value}`
      );
      const formattedSets = res.data.sets.map((s) => ({
        value: s.id,
        label: s.name,
      }));
      setSets(formattedSets);
      setIsDisabled(false);
    } catch (err) {
      console.error("Error loading sets", err);
    } finally {
      setIsLoading(false);
    }
  };

// ✅ Search Pokémon by name
const handleNameSearch = async () => {
  if (!localSearch.trim()) return;


  setIsLoading(true);
  try {
    const res = await axios.get(
      `https://api.tcgdex.net/v2/en/cards?name=${localSearch}`
    );
    const filtered = res.data.filter(
      (c) => typeof c.image === "string" && c.image.trim() !== ""
    );



    // 🔥 Dispatch event with search results
    window.dispatchEvent(new CustomEvent("cardsUpdated", { detail: filtered }));
  } catch (err) {
    console.error("Error searching Pokémon", err);
  } finally {
    setIsLoading(false);
  }
};

// ✅ Search Pokémon by selected set
const handleSetSearch = async () => {
  if (!selectedSet) return;
  setIsLoading(true);
  try {
    const res = await axios.get(
      `https://api.tcgdex.net/v2/en/sets/${selectedSet.value}`
    );
    const cards = res.data.cards || [];
    // 🔥 Dispatch event with set results
    window.dispatchEvent(new CustomEvent("cardsUpdated", { detail: cards }));
  } catch (err) {
    console.error("Error fetching cards for set", err);
  } finally {
    setIsLoading(false);
  }
};

const handleReset = () => {
  setLocalSearch("");
  setSelectedSeries(null);
  setSelectedSet(null);
  setSets([]);
  setIsDisabled(true);

  // Notify CardGrid to reload default cards
  const event = new CustomEvent("cardsUpdated", { detail: [] });
  window.dispatchEvent(event);
};



  // ✅ Unified Search (1 button only)
  const handleSearch = async () => {

   if(localSearch.trim()=="" && !selectedSet ){
    return
   }


    if (selectedSet) {
      await handleSetSearch();
    } else if (localSearch.trim()) {
      await handleNameSearch();
    } else {
      console.log("Please type a Pokémon name or select a set.");
    }
  };

  useEffect(() => {
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
          {isOpen && (
            <h2 className="text-lg font-bold text-black">Pokémon TCG</h2>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="font-bold px-2 rounded-sm border text-black"
          >
            {isOpen ? "<" : ">"}
          </button>
        </div>

        {/* Search */}
        {isOpen && (
          <div className="p-4">
            <h3 className="mb-4 font-bold text-black">Search Pokémon</h3>
              <input
              type="text"
              placeholder="Search Pokémon..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyDown={(e) => {
                // if not empty, reset dropdowns
                if (e.target.value.trim() !== "") {
                  setSelectedSeries(null);
                  setSelectedSet(null);
                  setSets([]);
                  setIsDisabled(true);
                }

                // trigger search on Enter
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full bg-white px-3 py-2 text-sm text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>
        )}

        {/* Series */}
        {isOpen && (
          <div className="p-4">
            <h3 className="mb-4 font-bold text-black">Series</h3>
            <Select
              instanceId="series-select"
              options={series}
              isLoading={isLoading}
              placeholder="Select a series..."
              className="text-black"
              onChange={handleSeriesChange}
            />
          </div>
        )}

        {/* Sets */}
        {isOpen && (
          <div className="p-4">
            <h3 className="mb-4 font-bold text-black">Sets</h3>
            <Select
              instanceId="set-select"
              options={sets}
              isLoading={isLoading}
              isDisabled={isDisabled}
              placeholder="Select a set..."
              className="text-black"
              onChange={(opt) => setSelectedSet(opt)}
            />
          </div>
        )}

        {/* Single Search Button */}
        {isOpen && (
          <div className="p-4">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              isLoading={isLoading}
              label="Search Pokémon"
              variant="primary"

            />

           
            
             <Button
              onClick={handleReset}
              label="Reset"
              variant="secondary"
            />

          </div>
        )}
      </div>

    
    </>
  );
};

export default SideBar;
