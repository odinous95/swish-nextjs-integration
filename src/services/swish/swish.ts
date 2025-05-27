import fs from "fs";
import path from "path";
import axios from "axios";
import https from "https";

type SwishConfig = {
  payeeAlias: string;
  host: string;
  qrHost: string;
  cert: Buffer;
  key: Buffer;
  ca?: Buffer;
  passphrase?: string | null;
};

const isProd = process.env.SWISH_ENV === "production";

console.log(isProd);

const prodConfig: SwishConfig = {
  payeeAlias: "1232005668",
  host: "https://cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: Buffer.from(process.env.SWISH_CERT_BASE64!, "base64"),
  key: Buffer.from(process.env.SWISH_KEY_BASE64!, "base64"),
  passphrase: null,
};

const testConfig: SwishConfig = {
  payeeAlias: "1234679304",
  host: "https://mss.cpc.getswish.net/swish-cpcapi",
  qrHost: "https://mpc.getswish.net/qrg-swish",
  cert: fs.readFileSync(
    path.resolve(
      process.cwd(),
      "ssl/Swish_Merchant_TestCertificate_1234679304.pem"
    )
  ),
  key: fs.readFileSync(
    path.resolve(
      process.cwd(),
      "ssl/Swish_Merchant_TestCertificate_1234679304.key"
    )
  ),
  ca: fs.readFileSync(path.resolve(process.cwd(), "ssl/Swish_TLS_RootCA.pem")),
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
