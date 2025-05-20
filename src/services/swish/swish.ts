// lib/swish.ts
import fs from "fs";
import path from "path";
import https from "https";
import axios from "axios";

export interface SwishConfig {
  payeeAlias: string;
  host: string;
  qrHost: string;
  httpsAgent: https.Agent;
}

export function getSwishConfig(): SwishConfig {
  let cert: Buffer;
  let key: Buffer;
  let ca: Buffer;

  if (process.env.NODE_ENV === "production") {
    cert = Buffer.from(process.env.SWISH_CERT_BASE64!, "base64");
    key = Buffer.from(process.env.SWISH_KEY_BASE64!, "base64");
    ca = Buffer.from(process.env.SWISH_CA_BASE64!, "base64");
  } else {
    const certPath = path.resolve(process.cwd(), process.env.SWISH_CERT_PATH!);
    const keyPath = path.resolve(process.cwd(), process.env.SWISH_KEY_PATH!);
    const caPath = path.resolve(process.cwd(), process.env.SWISH_CA_PATH!);
    cert = fs.readFileSync(certPath);
    key = fs.readFileSync(keyPath);
    ca = fs.readFileSync(caPath);
  }

  const agent =
    process.env.NODE_ENV === "production"
      ? new https.Agent({
          cert,
          key,
          ca,
          passphrase: process.env.SWISH_PASSPHRASE_PROD,
          rejectUnauthorized: true, // must be true in production
        })
      : new https.Agent({
          cert,
          key,
          ca,
          passphrase: process.env.SWISH_PASSPHRASE_TEST,
          rejectUnauthorized: false, // allow self-signed in test
        });

  return {
    payeeAlias:
      process.env.NODE_ENV === "production"
        ? process.env.SWISH_PAYEE_ALIAS_PROD!
        : process.env.SWISH_PAYEE_ALIAS_TEST!,
    host:
      process.env.NODE_ENV === "production"
        ? process.env.SWISH_HOST_PROD!
        : process.env.SWISH_HOST_TEST!,
    qrHost: process.env.SWISH_QR!,
    httpsAgent: agent,
  };
}

export async function swishRequest<T = any>(
  method: "GET" | "POST" | "PUT",
  url: string,
  data?: any
): Promise<{ data: T; status: number; headers: Record<string, string> }> {
  const { httpsAgent } = getSwishConfig();

  const resp = await axios.request<T>({
    method,
    url,
    data,
    httpsAgent,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  return {
    data: resp.data,
    status: resp.status,
    headers: Object.fromEntries(
      Object.entries(resp.headers).map(([k, v]) => [k.toLowerCase(), String(v)])
    ),
  };
}
