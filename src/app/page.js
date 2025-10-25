"use client";
import React, { useState } from "react";
import SideBar from "./components/SideBar/SideBar";
import CardGrid from "./components/CardGrid/CardGrid";

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-gray-900 min-h-screen">
      {/* Sidebar */}
      <SideBar
        isOpen={isOpen} setIsOpen={setIsOpen} 
      />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <CardGrid  isOpen={isOpen} />
      </main>
    </div>
  );
}
