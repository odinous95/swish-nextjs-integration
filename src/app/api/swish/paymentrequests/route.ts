import { NextRequest, NextResponse } from "next/server";
import { getSwishConfig, swishRequest } from "@/services/swish/swish";
import { v4 as uuidv4 } from "uuid"; // Use uuid package

// export async function PUT(req: NextRequest) {
//   const cfg = getSwishConfig();
//   let { payerAlias, amount, message, callbackIdentifier } = await req.json();
//   payerAlias = "46" + payerAlias.replace(/^0/, "");
//   const instructionUUID = uuidv4().toUpperCase().replaceAll("-", "");
//   const payload = {
//     payeePaymentReference: instructionUUID.slice(0, 10),
//     payeeAlias: cfg.payeeAlias,
//     amount,
//     currency: "SEK" as const,
//     payerAlias,
//     message,
//     callbackUrl: process.env.CALLBACK_URL!,
//   };
//   console.log("Swish payload:", payload);

//   const createRes = await swishRequest(
//     "PUT",
//     `${cfg.host}/api/v2/paymentrequests/${instructionUUID}`,
//     payload
//   );

//   console.log("Swish createRes:", createRes);

//   const status = (createRes as any).status;
//   if (status !== 201) {
//     return NextResponse.json(
//       {
//         error: "Failed to create E-commerce payment request",
//         details: createRes, // <-- add this to get more info
//       },
//       { status }
//     );
//   }

//   const detailRes = await swishRequest(
//     "GET",
//     `${cfg.host}/api/v1/paymentrequests/${instructionUUID}`
//   );
//   const id = (detailRes as any).id;

//   return NextResponse.json({
//     id,
//     url: `${cfg.host}/api/v1/paymentrequests/${instructionUUID}`,
//   });
// }

export async function PUT(req: NextRequest) {
  const cfg = getSwishConfig();
  let { payerAlias, amount, message } = await req.json();
  payerAlias = "46" + payerAlias.replace(/^0/, "");
  const instructionUUID = uuidv4().toUpperCase().replaceAll("-", "");

  const payload = {
    payeePaymentReference: instructionUUID.slice(0, 10),
    payeeAlias: cfg.payeeAlias,
    amount,
    currency: "SEK" as const,
    payerAlias,
    message,
    callbackUrl: process.env.CALLBACK_URL!,
  };

  const createUrl = `${cfg.host}/api/v2/paymentrequests/${instructionUUID}`;
  console.log("Calling Swish CREATE v2 at:", createUrl);
  console.log("Payload:", payload);

  const { data, status, headers } = await swishRequest(
    "PUT",
    createUrl,
    payload
  );

  if (status !== 201) {
    return NextResponse.json(
      { error: "Create failed", details: { status, headers, data } },
      { status }
    );
  }

  const detailUrl = `${cfg.host}/api/v1/paymentrequests/${instructionUUID}`;
  const { data: detailData } = await swishRequest("GET", detailUrl);

  return NextResponse.json({
    id: instructionUUID,
    url: detailUrl,
    status: detailData.status,
    // Optional: deeplink or paymentReference
  });
}
