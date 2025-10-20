"use client";

import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar/SideBar";
import CardGrid from "./components/CardGrid/CardGrid";


export default function Home() {
  const [isOpen, setIsOpen] = useState(true);
  const [search, setSearch] = useState(""); // ✅ add search state here

  // Detect screen width on first load
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false); // Close sidebar on mobile
    } else {
      setIsOpen(true); // Open on desktop
    }

    // Optional: recheck when window resizes
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-red transition-all duration-300">
        <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        search={search}
        setSearch={setSearch}
      />
      

      <main
        className={`transition-all duration-300 p-6 flex-1 ${
          isOpen ? "ml-0" : "ml-0"
        }`}
        style={{
          width: isOpen ? "calc(100% - 16rem)" : "100%",
          transition: "width 0.3s ease-in-out",
        }}
      >
        <CardGrid  search={search}/>
      </main>
    </div>
  );
}
