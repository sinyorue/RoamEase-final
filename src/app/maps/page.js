"use client";
import GlobalApi from "@/Shared/GlobalApi";
import BusinessList from "@/components/Home/BusinessList";
import CategoryList from "@/components/Home/CategoryList";
import GoogleMapView from "@/components/Home/GoogleMapView";
import RangeSelect from "@/components/Home/RangeSelect";
import SelectRating from "@/components/Home/SelectRating";
import SkeltonLoading from "@/components/SkeltonLoading";
import { UserLocationContext } from "@/context/UserLocationContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import HeaderNavBar from "../../components/HeaderNavBar";

/**
 * Home page component.
 *
 * Displays a map, business list, category filter, radius filter
 * and rating filter. Fetches businesses from Google Places API
 * based on selected filters and user location. Handles loading
 * and error states.
 */
export default function Home() {
  const [category, setCategory] = useState();
  const [radius, setRadius] = useState(2500);
  const [businessList, setBusinessList] = useState([]);
  const [businessListOrg, setBusinessListOrg] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLocation, setUserLocation } = useContext(UserLocationContext);

  useEffect(() => {
    const getGooglePlace = () => {
      if (category) {
        setLoading(true);

        GlobalApi.getGooglePlace(
          category,
          radius,
          userLocation.lat,
          userLocation.lng,
        ).then((resp) => {
          // console.log(resp.data.product.results);
          setBusinessList(resp.data.product.results);
          setBusinessListOrg(resp.data.product.results);
          setLoading(false);
        });
      }
    };

    getGooglePlace();
  }, [category, radius, userLocation.lat, userLocation.lng]);

  const onRatingChange = (rating) => {
    if (rating.length == 0) {
      setBusinessList(businessListOrg);
    }
    const result = businessList.filter((item) => {
      for (let i = 0; i < rating.length; i++) {
        if (item.rating >= rating[i]) {
          return true;
        }
        return false;
      }
    });

    console.log(result);
  };
  return (
    <div>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w min-h-[200px] rounded"
      >
        <ResizablePanel defaultSize={25}>
          <div className=" flex h-full w-full ">
            <div className="grid grid-flow-row grid-cols-1">
              <CategoryList onCategoryChange={(value) => setCategory(value)} />
              <RangeSelect onRadiusChange={(value) => setRadius(value)} />
              <SelectRating onRatingChange={(value) => onRatingChange(value)} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={75}>
          <GoogleMapView businessList={businessList} />
          <ScrollArea direction="horizontal">
            <div className="flex h-full w-full overscroll-y-contain scroll-smooth ">
              {!loading ? (
                <BusinessList businessList={businessList} />
              ) : (
                <div className="flex h-full  w-full gap-3 ">
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <SkeltonLoading key={index} />
                  ))}
                </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
