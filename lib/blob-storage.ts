import type { PutCommandOptions } from "@vercel/blob";

export function hasBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID),
  );
}

export function shouldUseBlob() {
  return hasBlobCredentials();
}

export function isPersistentStorageConfigured() {
  return shouldUseBlob() || !process.env.VERCEL;
}

export function getBlobClientOptions() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN };
  }

  if (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID) {
    return {
      oidcToken: process.env.VERCEL_OIDC_TOKEN,
      storeId: process.env.BLOB_STORE_ID,
    };
  }

  return {};
}

export function getBlobPutOptions<T extends PutCommandOptions>(
  options: T,
): T {
  return {
    ...options,
    ...getBlobClientOptions(),
  };
}
