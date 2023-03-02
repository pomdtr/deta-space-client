import fetch from "cross-fetch";
import crypto from "crypto";

class NoAccessTokenError extends Error {
  constructor() {
    super("Access token not found");
  }
}

class InvalidAccessTokenError extends Error {
  constructor() {
    super("Invalid access token");
  }
}

class SpaceClientClass {
  private spaceRoot: string = "https://deta.space/api/v0";

  constructor(private keyId: string, private keySecret: string) {}

  signString(keySecret: string, toSign: string): string {
    return crypto.createHmac("sha256", keySecret).update(toSign).digest("hex");
  }

  setSpaceRoot(host: string) {
    this.spaceRoot = host;
  }

  async get(endpoint: string) {
    return this.request("GET", endpoint, "");
  }

  async post(endpoint: string, body: any) {
    return this.request("POST", endpoint, JSON.stringify(body));
  }

  private async request(method: string, endpoint: string, body: string) {
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }

    const timestamp = Date.now().toString().slice(0, 10);
    const contentType = "application/json";

    const toSign = `${method}\n${
      "/api/v0" + endpoint
    }\n${timestamp}\n${contentType}\n${body}\n`;

    const signature = this.signString(this.keySecret, toSign);

    return fetch(`${this.spaceRoot}${endpoint}`, {
      method,
      headers: {
        "Content-Type": contentType,
        "X-Deta-Timestamp": timestamp,
        "X-Deta-Signature": `v0=${this.keyId}:${signature}`,
      },
    });
  }
}

export function SpaceClient(accessToken?: string) {
  if (!accessToken) {
    if (process.env.DETA_SPACE_TOKEN) {
      accessToken = process.env.DETA_SPACE_TOKEN;
    } else {
      throw new NoAccessTokenError();
    }
  }

  const [keyId, keySecret] = accessToken.split("_");
  if (!keyId || !keySecret) {
    throw new InvalidAccessTokenError();
  }

  return new SpaceClientClass(keyId, keySecret);
}
