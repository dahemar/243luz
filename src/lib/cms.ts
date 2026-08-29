export type EditionAvailability = "available" | "sold" | "enquire";

export interface Exhibition {
  id: string;
  title: string;
  artistIds: string[];
  startDate: string;
  endDate: string;
  description: string;
  featuredImage: string;
  folder: string;
  images: string[];
}

export interface Artist {
  id: string;
  name: string;
  biography: string;
  exhibitionIds: string[];
  wixFolder?: string;
  images: string[];
}

export interface Edition {
  id: string;
  artistId: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  editionSize: string;
  price: string;
  currency: string;
  availability: EditionAvailability;
  description: string;
  image: string;
  buyUrl: string;
}

interface Cms {
  exhibitions: Exhibition[];
  artists: Artist[];
  editions: Edition[];
}

const SHEETS_ID = "1I2ab8Lq6vy03UFU7aQ7tCnyddoh8Y06YD_drcH48CzI";
const SHEETS_API_KEY = "AIzaSyBHQgbSv588A3qr-Kzeo6YrZ9TbVNlrSkc";
const WIX_API = "https://www.wixapis.com/site-media/v1";
const CACHE_TTL = 60_000;

let cache: { data: Cms; at: number } | null = null;

function sanitize(name: string): string {
  return name.replace(/&/g, "-");
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (!rows || rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const result: Record<string, string>[] = [];
  for (let r = 1; r < rows.length; r++) {
    const entry: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      entry[headers[i]] = (rows[r][i] ?? "").trim();
    }
    if (entry["id"]) result.push(entry);
  }
  return result;
}

async function fetchSheet(tab: string): Promise<Record<string, string>[]> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodeURIComponent(tab)}?key=${SHEETS_API_KEY}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as { values?: string[][] };
    return rowsToObjects(data.values ?? []);
  } catch {
    return [];
  }
}

async function wixGet(path: string, params: Record<string, string>): Promise<any> {
  const key = process.env.WIX_API_KEY ?? "";
  const siteId = process.env.WIX_SITE_ID ?? "";
  if (!key || !siteId) return null;
  const qs = Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");
  try {
    const res = await fetch(`${WIX_API}/${path}?${qs}`, {
      headers: { Authorization: key, "wix-site-id": siteId },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function wixPaginate(path: string, params: Record<string, string>, key: string): Promise<any[]> {
  const items: any[] = [];
  let cursor: string | undefined;
  for (let i = 0; i < 50; i++) {
    const p: Record<string, string> = { ...params };
    if (cursor) p["paging.cursor"] = cursor;
    const data = await wixGet(path, p);
    if (!data) break;
    items.push(...(data[key] ?? []));
    cursor = data?.nextCursor?.cursors?.next;
    if (!cursor) break;
  }
  return items;
}

async function resolveFolderImages(
  folderNames: string[]
): Promise<Map<string, { name: string; url: string }[]>> {
  const result = new Map<string, { name: string; url: string }[]>();
  const unique = [...new Set(folderNames.filter(Boolean))];
  if (unique.length === 0) return result;

  const folders = await wixPaginate("folders", { "paging.limit": "100" }, "folders");
  const nameToId = new Map<string, string>();
  for (const f of folders) {
    const name = sanitize((f.displayName || (f.id || "").slice(0, 8)).trim());
    nameToId.set(name, f.id);
  }

  for (const folderName of unique) {
    const fid = nameToId.get(folderName);
    if (!fid) {
      result.set(folderName, []);
      continue;
    }
    const files = await wixPaginate("files", { "paging.limit": "100", parentFolderId: fid }, "files");
    result.set(
      folderName,
      files
        .map((ff) => ({ name: sanitize(ff.displayName || ""), url: ff.url || "" }))
        .filter((x) => x.url)
    );
  }
  return result;
}

function resolveImage(img: string, folderImages: Map<string, { name: string; url: string }[]>): string {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  const parts = img.split("/");
  if (parts.length >= 4 && parts[1] === "media") {
    const folder = parts[2];
    const file = parts[3];
    const files = folderImages.get(folder) || [];
    const hit = files.find((f) => f.name === file);
    if (hit) return hit.url;
  }
  return img;
}

function startDateToTime(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  if (!Number.isNaN(parsed)) return parsed;
  const year = dateStr.match(/\b(19|20)\d{2}\b/)?.[0];
  if (year) return Date.parse(`1 January ${year}`);
  return Number.NaN;
}

async function loadCms(): Promise<Cms> {
  const [exhRows, artRows, linkRows, editRows] = await Promise.all([
    fetchSheet("Exhibitions"),
    fetchSheet("Artists"),
    fetchSheet("Exhibitions_Artists"),
    fetchSheet("Editions"),
  ]);

  const artToExh: Record<string, string[]> = {};
  const exhToArt: Record<string, string[]> = {};
  for (const lr of linkRows) {
    const eid = lr["exhibition_id"];
    const aid = lr["artist_id"];
    if (eid && aid) {
      (artToExh[aid] ??= []).push(eid);
      (exhToArt[eid] ??= []).push(aid);
    }
  }

  const exhFolders = exhRows.map((r) => r["wix_folder_name"] || "").filter(Boolean);
  const artFolders = artRows.map((r) => r["wix_folder"] || "").filter(Boolean);
  const folderImages = await resolveFolderImages([...exhFolders, ...artFolders]);

  const exhibitions: Exhibition[] = exhRows.map((r) => {
    const folder = r["wix_folder_name"] || "";
    const files = folderImages.get(folder) || [];
    return {
      id: r["id"],
      title: r["title"] || "",
      artistIds: exhToArt[r["id"]] || [],
      startDate: r["start_date"] || "",
      endDate: r["end_date"] || "",
      description: r["description"] || "",
      featuredImage: files[0]?.url || "",
      folder,
      images: files.map((f) => f.url),
    };
  });

  const artists: Artist[] = artRows.map((r) => {
    const folder = r["wix_folder"] || "";
    const files = folderImages.get(folder) || [];
    return {
      id: r["id"],
      name: r["name"] || "",
      biography: (r["biography"] || "").replace(/\\n/g, "\n"),
      exhibitionIds: artToExh[r["id"]] || [],
      wixFolder: folder || undefined,
      images: files.map((f) => f.url),
    };
  });

  const editions: Edition[] = editRows.map((r) => {
    let avail = (r["availability"] || "available").toLowerCase();
    if (!["available", "sold", "enquire"].includes(avail)) avail = "available";
    return {
      id: r["id"],
      artistId: r["artist_id"] || "",
      title: r["title"] || "",
      year: r["year"] || "",
      medium: r["medium"] || "",
      dimensions: r["dimensions"] || "",
      editionSize: r["edition_size"] || "",
      price: r["price"] || "",
      currency: r["currency"] || "",
      availability: avail as EditionAvailability,
      description: r["description"] || "",
      image: resolveImage(r["image"] || "", folderImages),
      buyUrl: r["buy_url"] || "",
    };
  });

  return { exhibitions, artists, editions };
}

async function getCms(): Promise<Cms> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_TTL) return cache.data;
  const data = await loadCms();
  cache = { data, at: now };
  return data;
}

export async function getExhibitions(): Promise<Exhibition[]> {
  return (await getCms()).exhibitions;
}

export async function getExhibitionsNewestFirst(): Promise<Exhibition[]> {
  const exhibitions = await getExhibitions();
  return [...exhibitions].sort((a, b) => {
    const ta = startDateToTime(a.startDate);
    const tb = startDateToTime(b.startDate);
    if (Number.isNaN(ta)) return Number.isNaN(tb) ? 0 : 1;
    if (Number.isNaN(tb)) return -1;
    return tb - ta;
  });
}

export async function getArtists(): Promise<Artist[]> {
  return (await getCms()).artists;
}

export async function getArtistById(id: string): Promise<Artist | undefined> {
  return (await getArtists()).find((a) => a.id === id);
}

export async function getExhibitionById(id: string): Promise<Exhibition | undefined> {
  return (await getExhibitions()).find((e) => e.id === id);
}

export async function getArtistExhibitions(artistId: string): Promise<Exhibition[]> {
  return (await getExhibitions()).filter((e) => e.artistIds.includes(artistId));
}

export async function getEditions(): Promise<Edition[]> {
  return (await getCms()).editions;
}

export async function getEditionsByArtist(artistId: string): Promise<Edition[]> {
  return (await getEditions()).filter((e) => e.artistId === artistId);
}

export async function getEditionById(id: string): Promise<Edition | undefined> {
  return (await getEditions()).find((e) => e.id === id);
}

export async function getEditionArtists(): Promise<Artist[]> {
  const editions = await getEditions();
  const ids = new Set(editions.map((e) => e.artistId));
  return (await getArtists()).filter((a) => ids.has(a.id));
}
