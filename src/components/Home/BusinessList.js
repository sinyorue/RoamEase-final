import React, { useContext, useRef } from "react";
import BusinessItem from "./BusinessItem";
import { SelectedBusinessContext } from "@/context/SelectedBusinessContext";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function BusinessList({ businessList }) {
  const elementRef = useRef(null);
  const { selectedBusiness, setSelectedBusiness } = useContext(
    SelectedBusinessContext,
  );

  const slideRight = (element) => {
    element.scrollLeft += 500;
  };
  const slideLeft = (element) => {
    element.scrollLeft -= 500;
  };
  return (
    <ScrollArea className="h-[40px] whitespace-nowrap rounded-md border">
      <div
        className="flex gap-4 overflow-scroll overflow-x-auto
    scroll-smooth scrollbar-hide"
        ref={elementRef}
      >
        {businessList.map(
          (item, index) =>
            index <= 7 && (
              <div key={index} onClick={() => setSelectedBusiness(item)}>
                <BusinessItem business={item} />
              </div>
            ),
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default BusinessList;
