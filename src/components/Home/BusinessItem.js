import { UserLocationContext } from "@/context/UserLocationContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
/**
 * Imports Card components from the Card UI module.
 *
 * This allows using the various Card components in this file.
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BusinessItem({ business, showDir = false }) {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const photo_ref = business?.photos
    ? business?.photos[0]?.photo_reference
    : "";
  const { userLocation, setUserLocation } = useContext(UserLocationContext);
  const [distance, setDistance] = useState();
  /**
   * This useEffect hook runs whenever the business location or
   * user location changes. It calls the calculateDistance function
   * to recalculate the distance between the business and user.
   *
   * This allows the distance state to update automatically if the
   * user location changes after the component mounts.
   */
  useEffect(() => {
    calculateDistance(
      business.geometry.location.lat,
      business.geometry.location.lng,
      userLocation.lat,
      userLocation.lng,
    );
  }, [
    business.geometry.location.lat,
    business.geometry.location.lng,
    userLocation.lat,
    userLocation.lng,
  ]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; // in kilometers

    const degToRad = (deg) => {
      return deg * (Math.PI / 180);
    };

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadius * c;

    setDistance(distance.toFixed(1));
    return distance.toFixed(2); // Return the distance with 2 decimal places
  };

  const onDirectionClick = () => {
    window.open(
      "https://www.google.com/maps/dir/?api=1&origin=" +
        userLocation.lat +
        "," +
        userLocation.lng +
        "&destination=" +
        business.geometry.location.lat +
        "," +
        business.geometry.location.lng +
        "&travelmode=driving",
    );
  };

  /**
   * Renders a business card component with business details and actions.
   *
   * Displays business name, address, rating, distance from user if available.
   * Provides get directions button to navigate to business location.
   *
   * Card appearance updates on hover.
   */
  return (
    <Card
      className="mb-1 mt-[20px] w-[195px]
      flex-shrink-0 cursor-pointer rounded-lg
      bg-slate-400 p-2 shadow-md transition-all hover:scale-110"
    >
      <CardContent className="item flex flex-col gap-2 bg-slate-400">
        <div className="h-full w-full">
          <Image
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference=${photo_ref}&key=${GOOGLE_API_KEY}`}
            alt={business.name}
            width={180}
            height={80}
            className="h-[80px] rounded-lg object-cover "
          />
        </div>
        <h2 className="mt-1 line-clamp-1 text-[13px] font-bold">
          {business.name}
        </h2>
        <h2
          className="line-clamp-2 text-[10px] 
                text-gray-400"
        >
          {business.formatted_address}
        </h2>
      </CardContent>
      <CardFooter className="flex gap-1 bg-slate-400">
        <div className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-3 w-3 text-yellow-500"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-[10px] font-bold">{business.rating}</h2>
        </div>
        {showDir ? (
          <div className="mt-1 border-t-[1px] p-1">
            <h2
              className="flex
              items-center justify-between text-[#0075ff]"
            >
              Dist: {distance} Mile
              <span
                className="rounded-full border-[1px] border-blue-500
              p-1
              hover:bg-blue-500
              hover:text-white"
                onClick={() => onDirectionClick()}
              >
                Get Direction
              </span>
            </h2>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default BusinessItem;
