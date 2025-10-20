"use client";
import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import axios from "axios";

const CardGrid = ({ search = "" }) => {
  const [cards, setCards] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 100;

  const fetchCards = async (pageNumber) => {
    setIsLoading(true);
    try {
      const headers = { "Content-Type": "application/json" };
      let url = "";

      if (search.trim() === "") {
        // no search → use paginated API
        url = `https://api.tcgdex.net/v2/en/cards?pagination:page=${pageNumber}&pagination:itemsPerPage=${itemsPerPage}`;
      } else {
        console.log('guna search')
        // search → use search API
        url = `https://api.tcgdex.net/v2/en/cards?name=${search}`;
      }

      const response = await axios.get(url, { headers });

      const filtered = response.data.filter(
        (card) => typeof card.image === "string" && card.image.trim() !== ""
      );

      setCards(filtered);

      // ✅ If paginated request, estimate total pages
      if (search.trim() === "") {
        const estimatedTotalCards = 1500; // adjust if you know the real count
        setTotalPages(Math.ceil(estimatedTotalCards / itemsPerPage));
      } else {
        // For search, only 1 page of results
        setTotalPages(1);
      }

    } catch (error) {
      console.log("Error fetching cards", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCards(page);
  }, [page, search]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="text-center text-white py-10">Loading...</div>
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
          {cards.length > 0 ? (
            cards.map((c) => (
              <Card key={c.id} name={c.name} image={c.image} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No Pokémon found
            </div>
          )}
        </div>
      )}

      {search.trim() === "" && (
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
