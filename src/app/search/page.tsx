"use client"
import Hero from '@/components/Hero'
import PlaceList from '@/components/PlaceList'
import Image from 'next/image'
import { useEffect } from 'react'
import { useState } from 'react'

/**
 * A description of the entire function.
 *
 * @param {string} value - The value used to fetch the place list.
 * @return {void} This function does not return any value.
 */

export default function Home() {

  const [placeList,setPlaceList]=useState([])

  useEffect(() =>{
    getPlaceList('Hotels in London');;

  }, [])

  const getPlaceList=async(value:string)=>{
    setPlaceList([]);
    const result=await fetch("/api/google-place-api?q="+value)
    const data=await result.json();

    setPlaceList(data.resp.results);
  }
  return (
    <div>
      <Hero userInput={(value:string)=>getPlaceList(value)} />

      {PlaceList? <PlaceList placeList={placeList}/>:null}

    </div>
    
  )
}
