import crypto from "crypto";
if (!globalThis.fetch) {
  globalThis.fetch = require("cross-fetch");
}

class InvalidAccessTokenError extends Error {
  constructor() {
    super("Invalid access token");
  }
}

function signString(keySecret: string, toSign: string) {
  return crypto.createHmac("sha256", keySecret).update(toSign).digest("hex");
}

export function fetchFn(accessToken: string) {
  const [keyId, keySecret] = accessToken.split("_");
  if (!keyId || !keySecret) {
    throw new InvalidAccessTokenError();
  }

  return async (url: string, options?: RequestInit) => {
    if (!url.startsWith("https") && !url.startsWith("http")) {
      if (!url.startsWith("/")) {
        url = `/${url}`;
      }

      if (!url.startsWith("/v0")) {
        url = `/v0${url}`;
      }

      url = `https://deta.space/api${url}`;
    }

    const { pathname, search } = new URL(url);
    const timestamp = Date.now().toString().slice(0, 10);
    const contentType = "application/json";

    const toSign = `${
      options?.method || "GET"
    }\n${pathname}${search}\n${timestamp}\n${contentType}\n${
      options?.body || ""
    }\n`;

    const signature = signString(keySecret, toSign);

    const res = await fetch(url, {
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
