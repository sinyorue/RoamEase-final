import React from "react";
import Image from "next/image";
import category from "@/Shared/category";
import { useState } from "react";
function Hero({ userInput }: any) {
  const [searchInput, setSearchInput] = useState<string>();

  return (
    <div className="text-center">
      <div>
        <div>
          <h2 className="text-[55px] font-semibold tracking-widest text-yellow-600">
            ROAMEASE
          </h2>
          <h2 className="text-[20px]">Your Awesome holiday</h2>
          <div className="z-10 mt-5 flex items-center justify-center gap-2">
            <input
              type="text"
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search destination"
              className="boarder-[1px] z-10 w-[36%] rounded-full p-3 px-5 
            shadow-md outline-cyan-950"
            />
            <button
              onClick={() => userInput(searchInput)}
              className="z-10 cursor-pointer rounded-full bg-yellow-600 p-3 
            shadow-md transition-all hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </div>
          <div className="z-10 mt-5 flex flex-col items-center justify-center">
            <h2> Browse the categories</h2>
            <div className="mt-3 grid w-[50%] grid-cols-3 justify-center gap-5 md:grid-cols-7">
              {category.map((item, index) => (
                <div
                  key={index}
                  className="z-10 w-[60px] cursor-pointer rounded-full border-[2px] bg-white
                p-4 transition-all hover:scale-125 hover:border-yellow-400"
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
