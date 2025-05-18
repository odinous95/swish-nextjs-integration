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
  const cert = Buffer.from(process.env.SWISH_CERT_BASE64!, "base64");
  const key = Buffer.from(process.env.SWISH_KEY_BASE64!, "base64");
  const ca = Buffer.from(process.env.SWISH_CA_BASE64!, "base64");

  const agent = new https.Agent({
    cert,
    key,
    ca,
    passphrase: process.env.SWISH_PASSPHRASE,
    // rejectUnauthorized: true,
  });

  return {
    payeeAlias: process.env.SWISH_PAYEE_ALIAS!,
    host: process.env.SWISH_HOST!,
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
