import fs from "fs";
import path from "path";
import axios from "axios";
import https from "https";

type SwishConfig = {
  payeeAlias: string;
  host: string;
  qrHost: string;
  cert?: Buffer | string;
  key?: Buffer | string;
  ca?: Buffer | string;
  passphrase?: string | null;
};

const isProd = process.env.SWISH_ENV === "production";

console.log(isProd);

const prodConfig: SwishConfig = {
  payeeAlias: process.env.SWISH_PAYEE_ALIAS_PROD!,
  host:
    process.env.SWISH_HOST_PROD || "https://mss.cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: process.env.SWISH_CERT_BASE64!,
  key: process.env.SWISH_KEY_BASE64!,
  passphrase: process.env.SWISH_PASSPHRASE_PROD || null,
};

const testConfig: SwishConfig = {
  payeeAlias: "1234679304",
  host: "https://mss.cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: process.env.SWISH_CERT_TEST,
  key: process.env.SWISH_KEY_TEST,
  ca: process.env.SWISH_CA_TEST,
  passphrase: "swish",
};

export async function swishRequest<T>(
  method: "POST" | "GET",
  url: string,
  data?: any
) {
  const httpsAgent = new https.Agent({
    cert: swishConfig.cert,
    key: swishConfig.key,
    ca: swishConfig.ca,
    passphrase: swishConfig.passphrase || undefined,
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  });
  const response = await axios.request<T>({
    method,
    url,
    data,
    httpsAgent,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response;
}

export const swishConfig = isProd ? prodConfig : testConfig;
