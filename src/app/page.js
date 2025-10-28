"use client";

import React, { useState } from "react";
import SideBar from "./components/SideBar/SideBar";
import CardGrid from "./components/CardGrid/CardGrid";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    // Mobile: column (sidebar on top). Desktop (sm): row (sidebar left).
    <div className="flex flex-col sm:flex-row bg-gray-900 min-h-screen">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className="flex-1 p-4">
        <CardGrid isOpen={isOpen} />
      </main>
    </div>
  );
}
