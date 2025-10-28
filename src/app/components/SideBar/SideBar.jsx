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

  // fetch series
  useEffect(() => {
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
    fetchSeries();
  }, []);

  const handleSeriesChange = async (option) => {
    setSelectedSeries(option);
    setSelectedSet(null);
    setIsLoading(true);
    setIsDisabled(true);
    setLocalSearch("");

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

  const handleSearch = async () => {
    if (!localSearch.trim() && !selectedSet) return;

    setIsLoading(true);
    try {
      if (selectedSet) {
        const res = await axios.get(
          `https://api.tcgdex.net/v2/en/sets/${selectedSet.value}`
        );
        const cards = res.data.cards || [];
        window.dispatchEvent(new CustomEvent("cardsUpdated", { detail: cards }));
      } else {
        const res = await axios.get(
          `https://api.tcgdex.net/v2/en/cards?name=${localSearch}`
        );
        const filtered = res.data.filter(
          (c) => typeof c.image === "string" && c.image.trim() !== ""
        );
        window.dispatchEvent(new CustomEvent("cardsUpdated", { detail: filtered }));
      }
    } catch (err) {
      console.error("Error searching Pokémon", err);
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
    window.dispatchEvent(new CustomEvent("cardsUpdated", { detail: [] }));
  };

  return (
    <>
      {/*
        This container:
        - w-full on mobile (so it sits fully on top)
        - sm:w-64 on desktop (fixed sidebar width)
        - flex-none so it won't stretch the main area on desktop
        - order-first so it appears before main content on mobile
      */}
      <div
        className={`flex-none w-full sm:w-64 order-first bg-[url(../../public/pokedex.jpg)] bg-cover bg-center shadow-md transition-all duration-300 ease-in-out`}
      >
        {/* Header always visible (full-width on mobile) */}
        <div className="p-4 border-b flex items-center justify-between sm:bg-transparent">
          <h2 className="text-lg font-bold text-black">Pokémon TCG</h2>

          {/* Toggle visible only on mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden ml-2 px-2 py-1 rounded-md border text-black"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Collapse filters" : "Expand filters"}
          >
            {isOpen ? "▲" : "▼"}
          </button>
        </div>

        {/* Collapse area:
            - On mobile, when closed -> max-h-0 (hidden)
            - When open -> max-h large (visible)
            - On desktop (sm:), always visible (sm:max-h-none)
        */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out
            ${isOpen ? "max-h-[1200px] opacity-100" : "max-h-0 opacity-0 sm:opacity-100"}
            sm:max-h-none
          `}
        >
          <div className="p-4 space-y-4 sm:bg-transparent">
            {/* Search */}
            <div>
              <label className="block mb-1 text-sm font-medium text-black">Search Pokémon</label>
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-white px-3 py-2 text-sm text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Series */}
            <div>
              <label className="block mb-1 text-sm font-medium text-black">Series</label>
              <Select
                instanceId="series-select"
                options={series}
                isLoading={isLoading}
                placeholder="Select a series..."
                className="text-black"
                onChange={handleSeriesChange}
                value={selectedSeries}
              />
            </div>

            {/* Sets */}
            <div>
              <label className="block mb-1 text-sm font-medium text-black">Sets</label>
              <Select
                instanceId="set-select"
                options={sets}
                isLoading={isLoading}
                isDisabled={isDisabled}
                placeholder="Select a set..."
                className="text-black"
                onChange={(opt) => setSelectedSet(opt)}
                value={selectedSet}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                isLoading={isLoading}
                label="Search"
                variant="primary"
              />
              <Button onClick={handleReset} label="Reset" variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
