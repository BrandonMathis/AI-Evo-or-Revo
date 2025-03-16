import { NextResponse } from "next/server";
import { getAllImages } from "@/utils/imageUtils";

export async function GET() {
  try {
    const images = getAllImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
