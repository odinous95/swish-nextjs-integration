// lib/swish.ts
import fs from "fs";
import path from "path";
import https from "https";
import axios, { AxiosRequestConfig } from "axios";

export interface SwishConfig {
  payeeAlias: string;
  host: string;
  qrHost: string;
  httpsAgent: https.Agent;
}

export function getSwishConfig(): SwishConfig {
  const certPath = path.resolve(process.cwd(), process.env.SWISH_CERT_PATH!);
  const keyPath = path.resolve(process.cwd(), process.env.SWISH_KEY_PATH!);
  const caPath = path.resolve(process.cwd(), process.env.SWISH_CA_PATH!);

  const agent = new https.Agent({
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
    ca: fs.readFileSync(caPath),
    passphrase: process.env.SWISH_PASSPHRASE,
    // rejectUnauthorized: true, // must be true in production
  });

  return {
    payeeAlias: process.env.SWISH_PAYEE_ALIAS!,
    host: process.env.SWISH_HOST!,
    qrHost: process.env.SWISH_QR!,
    httpsAgent: agent,
  };
}

/**
 * Helper to call Swish API
 */
export async function swishRequest<T = any>(
  method: "GET" | "POST" | "PUT",
  url: string,
  data?: any
): Promise<T> {
  const { httpsAgent } = getSwishConfig();

  const opts: AxiosRequestConfig = {
    method,
    url,
    data,
    httpsAgent,
    headers: {
      "Content-Type": "application/json",
    },
    validateStatus: () => true, // we'll handle status codes manually
  };

  const resp = await axios.request<T>(opts);
  return resp.data as T & { status?: number; headers?: any };
}
