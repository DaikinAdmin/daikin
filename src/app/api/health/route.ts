import { NextResponse } from "next/server";
import { checkDatabaseConnection, getDatabaseInfo } from "@/db/utils";

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection();
    const dbInfo = await getDatabaseInfo();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
      database: {
        connected: isConnected,
        activeConnections: dbInfo?.activeConnections || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
