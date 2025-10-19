import React from "react";
import HomePage from "../pages/HomePage";
import Navbar from "./Navbar";

const MainLayout = () => {
  return (
    <div className="" id="mainContainer">
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      {/* grid pattern */}
      <div className="grid-pattern">
        <div className="flex flex-col min-h-screen items-center p-2">
          <div className="w-full max-w-7xl px-3 py-1 ">
            <Navbar />
            <HomePage/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
