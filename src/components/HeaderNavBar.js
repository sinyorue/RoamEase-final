"use client";

import React, { useEffect, useState } from "react";

function HeaderNavBar() {
  return (
    <div
      className="flex items-center
    justify-between p-2 shadow-md"
    >
      <div
        className=" hidden w-[40%] gap-3
      rounded-md bg-gray-100 p-[6px] md:flex"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full 
        bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

export default HeaderNavBar;
