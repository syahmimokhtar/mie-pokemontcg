"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Card/Card";

const CardGrid = ({ isOpen, cards: externalCards }) => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(true); // ✅ New flag
  const itemsPerPage = 100;

  // ✅ Fetch default cards (used on load and when no search results)
  const fetchDefaultCards = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const url = `https://api.tcgdex.net/v2/en/cards?pagination:page=${pageNumber}&pagination:itemsPerPage=${itemsPerPage}`;
      const response = await axios.get(url);
      
      const filtered = response.data.filter(
        (card) => typeof card.image === "string" && card.image.trim() !== ""
      );
      console.log(filtered)

      setCards(filtered);
         setIsDefault(true); // ✅ Mark as default mode
      const estimatedTotalCards = 1500; // rough estimate
      setTotalPages(Math.ceil(estimatedTotalCards / itemsPerPage));
    } catch (err) {
      console.error("❌ Error fetching default cards:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Load default cards on first render
  useEffect(() => {
    fetchDefaultCards(1);
  }, []);

 useEffect(() => {
  // ✅ Fetch default cards on load
  fetchDefaultCards(1);

  const handleCardsUpdate = (e) => {
  const newCards = e.detail;
  if (newCards && newCards.length > 0) {
    setCards(newCards);
    setIsDefault(false); // ✅ disable pagination for search
  } else {
    fetchDefaultCards(1);
  }
};


  window.addEventListener("cardsUpdated", handleCardsUpdate);

  return () => {
    window.removeEventListener("cardsUpdated", handleCardsUpdate);
  };
}, []);


  // ✅ Pagination
  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchDefaultCards(newPage);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchDefaultCards(newPage);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 min-h-screen">
      {isLoading ? (
        <div className="text-center text-white py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
          {cards.length > 0 ? (
            cards.map((c) => 
            
            <Card key={c.id} name={c.name} image={c.image} />)
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No Pokémon found
            </div>
          )}
        </div>
      )}

      {/* ✅ Only show pagination when showing default cards */}
      {isDefault && (
        <div className="flex justify-center items-center gap-4 my-6">
          <button
            onClick={handlePrev}
            disabled={page === 1 || isLoading}
            className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-600 transition"
          >
            Previous
          </button>

          <span className="text-white font-semibold">
            Page <span className="text-blue-400">{page}</span> /{" "}
            <span className="text-gray-400">{totalPages}</span>
          </span>

          <button
            onClick={handleNext}
            disabled={page >= totalPages || isLoading}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default CardGrid;
