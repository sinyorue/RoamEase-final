import React, { useState } from "react";
import PlaceItemCard from "./PlaceItemCard";
import SideDrawer from "./SideDrawer";
import Skelton from "./Skelton";

/**
 * Renders a list of places.
 *
 * Displays a grid of PlaceItemCards for the first 8 places in the placeList prop.
 * Shows a SideDrawer with details when a place is clicked.
 * Shows a loading skeleton UI if no places are passed in placeList.
 */
function PlaceList({ placeList }: any) {
  const [selectedPlace, setSelectedPlace] = useState<any>([]);
  return (
    <div className="z-10 mt-14 px-[10px] md:px-[120px]">
      <h2 className="mb-3 text-[20px] font-bold">Search Results</h2>
      <div
        className="grid 
        grid-cols-2 
        gap-5 
        md:grid-cols-3
        lg:grid-cols-4"
      >
        {placeList.map(
          (place: any, index: number) =>
            index <= 7 && (
              <div
                className="z-10"
                key={index}
                onClick={() => setSelectedPlace(place)}
              >
                <PlaceItemCard place={place} />
              </div>
            ),
        )}
      </div>
      {selectedPlace?.name ? (
        <div className="fixed right-0 top-0 z-20">
          <SideDrawer
            place={selectedPlace}
            close={() => setSelectedPlace([])}
          />
        </div>
      ) : null}

      {placeList?.length == 0 ? (
        <div
          className="grid 
        grid-cols-2 
        gap-5 
        md:grid-cols-3
        lg:grid-cols-4"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
            <Skelton key={index} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default PlaceList;
