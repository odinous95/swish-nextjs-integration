import { swishConfig, swishRequest } from "@/services/swish/swish";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const SWISH_CALLBACK_URL = process.env.SWISH_CALLBACK_URL!;
  try {
    const body = await req.json();
    const { amount, message } = body;

    const swishBody = {
      payeePaymentReference: "0123456789",
      callbackUrl: SWISH_CALLBACK_URL,
      payeeAlias: swishConfig.payeeAlias,
      amount,
      currency: "SEK",
      message,
    };

    const postResp = await swishRequest(
      "POST",
      `${swishConfig.host}/api/v1/paymentrequests`,
      swishBody
    );

    if (postResp.status !== 201) {
      return NextResponse.json(
        {
          error: "Swish Payment Request Failed",
          message: JSON.stringify(postResp.data),
        },
        { status: postResp.status }
      );
    }

    const location = postResp.headers["location"];
    const token = postResp.headers["paymentrequesttoken"];

    if (!location || !token) {
      return NextResponse.json(
        { error: "Missing Swish response headers" },
        { status: 500 }
      );
    }
    const getResp = await swishRequest("GET", location);
    // Assert the type of getResp.data to access id property
    const paymentData = getResp.data as { id: string };
    // console.log("Payment Data:", paymentData);
    return NextResponse.json({
      id: paymentData.id,
      url: location,
      token: token as string,
    });
  } catch (error: any) {
    console.error("Swish API error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "Unexpected error",
      },
      { status: 500 }
    );
  }
}
