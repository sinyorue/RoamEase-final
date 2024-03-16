import React, { useState } from "react";
import Data from "./../../Shared/Data";
import Image from "next/image";
function CategoryList({ onCategoryChange }) {
  const [categoryList, setCategoryList] = useState(Data.CategoryListData);
  const [selectedCategory, setSelectedCategory] = useState();
  return (
    <div>
      <h2 className="px-2 font-bold">Select Food Type</h2>
      <div
        className="grid 
        grid-cols-2 
        md:grid-cols-2 
        lg:grid-cols-3"
      >
        {categoryList.map((item, index) => (
          <div
            key={index}
            className={`m-2 flex
                cursor-pointer flex-col items-center
                justify-center rounded-lg border-purple-400 bg-gray-100 
                p-2 text-[13px]
                grayscale
                 hover:grayscale-0
                ${selectedCategory == index ? "border-[1px] grayscale-0" : null}`}
            onClick={() => {
              setSelectedCategory(index);
              onCategoryChange(item.value);
            }}
          >
            <Image src={item.icon} alt={item.name} width={40} height={40} />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryList;
