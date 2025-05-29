import { swishConfig, swishRequest } from "@/services/swish/swish";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");
    console.log("Fetching payment status for requestId:", requestId);
    if (!requestId) {
      return NextResponse.json(
        { error: "Missing requestId in query parameters" },
        { status: 400 }
      );
    }
    const url = `${swishConfig.host}/api/v1/paymentrequests/${requestId}`;
    const resp = await swishRequest("GET", url);
    const data = resp.data as {
      id: string;
      paymentReference?: string;
      status: string;
    };
    return NextResponse.json({
      id: data.id,
      paymentReference: data.paymentReference || "",
      status: data.status,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Failed to fetch payment request",
        message: error.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}
