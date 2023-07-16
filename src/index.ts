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
  private spaceRoot: string = "https://deta.space/api";

  constructor(private keyId: string, private keySecret: string) {}

  signString(keySecret: string, toSign: string): string {
    return crypto.createHmac("sha256", keySecret).update(toSign).digest("hex");
  }

  setSpaceRoot(host: string) {
    this.spaceRoot = host;
  }

  url(endpoint: string) {
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }
    return `${this.spaceRoot}${endpoint}`;
  }

  async get(endpoint: string) {
    return this.request("GET", endpoint);
  }

  async post(endpoint: string, body?: string) {
    return this.request("POST", endpoint, body);
  }

  async delete(endpoint: string, body?: string) {
    return this.request("DELETE", endpoint, body);
  }

  async put(endpoint: string, body?: string) {
    return this.request("PUT", endpoint, body);
  }

  async patch(endpoint: string, body?: string) {
    return this.request("PATCH", endpoint, body);
  }

  private async request(method: string, endpoint: string, body?: string) {
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }

    const timestamp = Date.now().toString().slice(0, 10);
    const contentType = "application/json";

    const toSign = `${method}\n/api${endpoint}\n${timestamp}\n${contentType}\n${
      body || ""
    }\n`;

    console.log(toSign);

    const signature = this.signString(this.keySecret, toSign);

    const res = await fetch(`${this.spaceRoot}${endpoint}`, {
      method,
      headers: {
        "Content-Type": contentType,
        "X-Deta-Timestamp": timestamp,
        "X-Deta-Signature": `v0=${this.keyId}:${signature}`,
      },
      body,
    });

    if (!res.ok) {
      throw new Error(
        `Request failed with status ${res.status}: ${res.statusText}`
      );
    }

    return res;
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
