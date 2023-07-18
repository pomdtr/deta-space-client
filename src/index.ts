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

function signString(keySecret: string, toSign: string) {
  return crypto.createHmac("sha256", keySecret).update(toSign).digest("hex");
}

export function fetchFn(accessToken?: string) {
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

  return async (endpoint: string, options?: RequestInit) => {
    if (!endpoint.startsWith("/")) {
      endpoint = `/${endpoint}`;
    }

    const timestamp = Date.now().toString().slice(0, 10);
    const contentType = "application/json";

    const toSign = `${
      options?.method || "GET"
    }\n/api${endpoint}\n${timestamp}\n${contentType}\n${options?.body || ""}\n`;

    const signature = signString(keySecret, toSign);

    const res = await fetch(`https://deta.space/api${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": contentType,
        "X-Deta-Timestamp": timestamp,
        "X-Deta-Signature": `v0=${keyId}:${signature}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Request failed with status ${res.status}: ${res.statusText}`
      );
    }

    return res;
  };
}
