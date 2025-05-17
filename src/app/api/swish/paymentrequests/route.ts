import { NextRequest, NextResponse } from "next/server";
import { getSwishConfig, swishRequest } from "@/lib/swish";
import { v4 as uuidv4 } from "uuid"; // Use uuid package

export async function PUT(req: NextRequest) {
  const { payerAlias, amount, message, callbackIdentifier } = await req.json();
  console.log("Swish PUT request:", { payerAlias, amount, message });
  const cfg = getSwishConfig();
  const instructionUUID = uuidv4().toUpperCase().replaceAll("-", "");

  const payload = {
    payeeAlias: cfg.payeeAlias,
    currency: "SEK" as const,
    callbackUrl: process.env.CALLBACK_URL!,
    amount: amount,
    message,
    payerAlias,
    callbackIdentifier: callbackIdentifier,
  };

  const createRes = await swishRequest(
    "PUT",
    `${cfg.host}/api/v2/paymentrequests/${instructionUUID}`,
    payload
  );

  console.log("Swish createRes:", createRes);

  const status = (createRes as any).status;
  if (status !== 201) {
    return NextResponse.json(
      {
        error: "Failed to create E-commerce payment request",
        details: createRes, // <-- add this to get more info
      },
      { status }
    );
  }

  // Optionally: retrieve status
  const detailRes = await swishRequest(
    "GET",
    `${cfg.host}/api/v1/paymentrequests/${instructionUUID}`
  );
  const id = (detailRes as any).id;

  return NextResponse.json({
    id,
    url: `${cfg.host}/api/v1/paymentrequests/${instructionUUID}`,
  });
}
