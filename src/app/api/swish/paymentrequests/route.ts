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

// export async function PUT(req: NextRequest) {
//   const cfg = getSwishConfig();
//   let { payerAlias, amount, message } = await req.json();
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

//   const createUrl = `${cfg.host}/api/v2/paymentrequests/${instructionUUID}`;
//   console.log("Calling Swish CREATE v2 at:", createUrl);
//   console.log("Payload:", payload);

//   const { data, status, headers } = await swishRequest(
//     "PUT",
//     createUrl,
//     payload
//   );

//   if (status !== 201) {
//     return NextResponse.json(
//       { error: "Create failed", details: { status, headers, data } },
//       { status }
//     );
//   }

//   const detailUrl = `${cfg.host}/api/v1/paymentrequests/${instructionUUID}`;
//   const { data: detailData } = await swishRequest("GET", detailUrl);

//   return NextResponse.json({
//     id: instructionUUID,
//     url: detailUrl,
//     status: detailData.status,
//     // Optional: deeplink or paymentReference
//   });
// }

export async function PUT(req: NextRequest) {
  // 1) Parse your incoming JSON
  const { amount, message, returnUrl } = await req.json();

  // 2) Build a unique instruction ID (uppercase hex)
  const instructionUUID = uuidv4().toUpperCase().replace(/-/g, "");

  // 3) Build the M-commerce payload (no payerAlias)
  const cfg = getSwishConfig();
  const payload = {
    payeePaymentReference: instructionUUID.slice(0, 10),
    payeeAlias: process.env.SWISH_PAYEE_ALIAS_PROD,
    amount,
    currency: "SEK" as const,
    message,
    callbackUrl: process.env.CALLBACK_URL!, // where Swish will POST status
    callbackIdentifier: instructionUUID, // your correlation id
  };

  // 4) Send the CREATE request (v2)
  const createUrl = `${cfg.host}/api/v2/paymentrequests/${instructionUUID}`;
  const { status, headers, data } = await swishRequest(
    "PUT",
    createUrl,
    payload
  );

  if (status !== 201) {
    console.error("Swish CREATE failed:", { status, headers, data });
    return NextResponse.json(
      { error: "Swish CREATE failed", status, headers, data },
      { status }
    );
  }

  // 5) Extract the paymentrequesttoken from response headers
  const token = headers["paymentrequesttoken"];
  console.log("Swish CREATE response headers:", headers);
  if (!token) {
    console.error("Missing token in Swish response headers", headers);
    return NextResponse.json(
      { error: "Missing paymentrequesttoken" },
      { status: 502 }
    );
  }

  // 6) Build the deep-link into Swish
  const encodedReturn = encodeURIComponent(returnUrl || "");
  const deeplink =
    `swish://paymentrequest?token=${token}` +
    (returnUrl ? `&callbackurl=${encodedReturn}` : "");

  // 7) Respond with the deeplink (or issue a redirect)
  return NextResponse.json({
    id: instructionUUID,
    deeplink,
  });
}
