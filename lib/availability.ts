import { list, put } from "@vercel/blob";
import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type AvailabilityEntry = {
  id: string;
  name: string;
  date: string;
  submittedAt: string;
};

const LOCAL_DIR = path.join(process.cwd(), "data", "availability");
const BLOB_PREFIX = "availability/";

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}

async function ensureLocalDir() {
  await mkdir(LOCAL_DIR, { recursive: true });
}

async function readLocalEntry(fileName: string): Promise<AvailabilityEntry | null> {
  try {
    const content = await readFile(path.join(LOCAL_DIR, fileName), "utf8");
    return JSON.parse(content) as AvailabilityEntry;
  } catch {
    return null;
  }
}

async function getLocalSubmissions(): Promise<AvailabilityEntry[]> {
  await ensureLocalDir();

  const files = await readdir(LOCAL_DIR);
  const entries = await Promise.all(
    files
      .filter((file) => file.endsWith(".json"))
      .map((file) => readLocalEntry(file)),
  );

  return entries.filter((entry): entry is AvailabilityEntry => entry !== null);
}

async function saveLocalSubmission(entry: AvailabilityEntry) {
  await ensureLocalDir();
  await writeFile(
    path.join(LOCAL_DIR, `${entry.id}.json`),
    JSON.stringify(entry),
    "utf8",
  );
}

async function getBlobSubmissions(): Promise<AvailabilityEntry[]> {
  const { blobs } = await list({ prefix: BLOB_PREFIX });

  const entries = await Promise.all(
    blobs.map(async (blob) => {
      const response = await fetch(blob.url);

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as AvailabilityEntry;
    }),
  );

  return entries.filter((entry): entry is AvailabilityEntry => entry !== null);
}

async function saveBlobSubmission(entry: AvailabilityEntry) {
  await put(`${BLOB_PREFIX}${entry.id}.json`, JSON.stringify(entry), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getSubmissions(): Promise<AvailabilityEntry[]> {
  let entries: AvailabilityEntry[];

  if (useBlobStorage()) {
    entries = await getBlobSubmissions();
  } else if (isVercelRuntime()) {
    entries = [];
  } else {
    entries = await getLocalSubmissions();
  }

  return entries.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return a.name.localeCompare(b.name);
  });
}

export async function saveSubmission(
  name: string,
  date: string,
): Promise<AvailabilityEntry> {
  if (isVercelRuntime() && !useBlobStorage()) {
    throw new Error("Blob storage is not configured for production.");
  }

  const entry: AvailabilityEntry = {
    id: crypto.randomUUID(),
    name: name.trim(),
    date,
    submittedAt: new Date().toISOString(),
  };

  if (useBlobStorage()) {
    await saveBlobSubmission(entry);
  } else {
    await saveLocalSubmission(entry);
  }

  return entry;
}
