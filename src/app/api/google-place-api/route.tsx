import { NextResponse } from "next/server";

const BASE_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
const GOOGLE_PLACE_KEY = process.env.GOOGLE_PLACE_KEY;

/**
 * GET handler for Google Places API search.
 *
 * Searches for places matching the 'q' query parameter and returns the JSON response.
 * Requires the GOOGLE_PLACE_KEY environment variable to be set.
 */
export async function GET(request: any) {
  const { searchParams }: any = new URL(request.url);
  const q = searchParams.get("q");

  const res = await fetch(
    BASE_URL + "query=" + q + "&key=" + GOOGLE_PLACE_KEY,
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  const resp = await res.json();

  return NextResponse.json({ resp });
}
