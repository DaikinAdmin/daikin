import { NextResponse } from "next/server";
import { getBanners } from "@/lib/banners.server";

// GET resolved banners for a location (public, used by the pages)
// e.g. /api/banners/public?location=home&locale=pl
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const locale = searchParams.get("locale");

  if (!location) {
    return NextResponse.json(
      { error: "Missing required query param: location" },
      { status: 400 }
    );
  }

  const banners = await getBanners(location, locale);

  return NextResponse.json(banners);
};
