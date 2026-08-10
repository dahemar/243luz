#!/usr/bin/env python3
"""Sync Google Sheets CMS → TypeScript data files for 243 Luz gallery."""

import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta

SPREADSHEET_ID = "1I2ab8Lq6vy03UFU7aQ7tCnyddoh8Y06YD_drcH48CzI"
API_KEY = "AIzaSyBHQgbSv588A3qr-Kzeo6YrZ9TbVNlrSkc"

WIX_API_KEY = os.environ.get("WIX_API_KEY", "")
WIX_SITE_ID = os.environ.get("WIX_SITE_ID", "")

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DATA_DIR = os.path.join(PROJECT_DIR, "src", "data")
MEDIA_DIR = os.path.join(PROJECT_DIR, "public", "media")

SHEETS_API = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values"
GOOGLE_SHEETS_EPOCH = datetime(1899, 12, 30)


def gsheet_date_to_iso(value: str) -> str:
    """Convert Google Sheets date serial number to YYYY-MM-DD."""
    try:
        serial = int(value)
        if serial < 3000 or serial > 100000:
            return value
        dt = GOOGLE_SHEETS_EPOCH + timedelta(days=serial)
        return dt.strftime("%Y-%m-%d")
    except (ValueError, OverflowError):
        return value


def sanitize(name: str) -> str:
    return name.replace("&", "-")


def fetch_sheet(sheet_name: str) -> list[list[str]]:
    url = f"{SHEETS_API}/{urllib.request.quote(sheet_name)}?key={API_KEY}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode())
    return data.get("values", [])


def rows_to_dicts(rows: list[list[str]]) -> list[dict]:
    if len(rows) < 2:
        return []
    headers = [h.strip().lower() for h in rows[0]]
    result = []
    for row in rows[1:]:
        entry = {}
        for i, h in enumerate(headers):
            entry[h] = row[i].strip() if i < len(row) else ""
        if entry.get("show", "y") != "y":
            continue
        result.append(entry)
    return result


def generate_artists(rows: list[dict], link_rows: list[dict]):
    # Build artist → exhibition mapping
    art_to_exh: dict[str, list[str]] = {}
    for lr in link_rows:
        eid = lr.get("exhibition_id", "")
        aid = lr.get("artist_id", "")
        if eid and aid:
            art_to_exh.setdefault(aid, []).append(eid)

    lines = [
        "export interface Artist {",
        "  id: string;",
        "  name: string;",
        "  sortName: string;",
        "  biography: string;",
        "  exhibitionIds: string[];",
        "  portrait?: string;",
        "  wixFolder?: string;",
        "}",
        "",
        "const artists: Artist[] = [",
    ]
    for r in rows:
        bio = r.get("biography", "").replace("\\n", "\n").replace("\n", "\\n")
        portrait = r.get("portrait", "")
        wix_folder = r.get("wix_folder", "")
        lines.append(f'  {{')
        lines.append(f'    id: "{r["id"]}",')
        lines.append(f'    name: "{r["name"]}",')
        lines.append(f'    sortName: "{r.get("sort_name", r["name"])}",')
        lines.append(f'    biography: `{bio}`,')
        lines.append(f'    exhibitionIds: {json.dumps(art_to_exh.get(r["id"], []))},')
        if portrait:
            lines.append(f'    portrait: "{portrait}",')
        if wix_folder:
            lines.append(f'    wixFolder: "{sanitize(wix_folder)}",')
        lines.append(f'  }},')
    lines.append("];")
    lines.append("")
    lines.append("export default artists;")
    lines.append("")

    out = os.path.join(DATA_DIR, "artists.ts")
    with open(out, "w") as f:
        f.write("\n".join(lines))
    print(f"  → {out} ({len(rows)} artists)")


def generate_exhibitions(exh_rows: list[dict], link_rows: list[dict]):
    # Build artist → exhibition mapping
    artists_for_exh: dict[str, list[str]] = {}
    for lr in link_rows:
        eid = lr.get("exhibition_id", "")
        aid = lr.get("artist_id", "")
        if eid and aid:
            artists_for_exh.setdefault(eid, []).append(aid)

    lines = [
        "export interface ExhibitionImage {",
        "  filename: string;",
        "  path: string;",
        "}",
        "",
        "export interface Exhibition {",
        "  id: string;",
        "  title: string;",
        "  artistIds: string[];",
        "  startDate: string;",
        "  endDate: string;",
        "  description: string;",
        "  featuredImage: string;",
        "  folder: string;",
        "}",
        "",
        "const exhibitions: Exhibition[] = [",
    ]

    for r in exh_rows:
        fid = r.get("wix_folder_name", "")
        # Find featured image from first file in the folder (local cache)
        featured = ""
        folder_path = os.path.join(MEDIA_DIR, fid) if fid else ""
        if fid and os.path.isdir(folder_path):
            img_files = sorted(
                [f for f in os.listdir(folder_path) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif"))]
            )
            if img_files:
                featured = f"/media/{fid}/{img_files[0]}"

        artist_ids = artists_for_exh.get(r["id"], [])

        lines.append(f'  {{')
        lines.append(f'    id: "{r["id"]}",')
        lines.append(f'    title: "{r["title"]}",')
        lines.append(f'    artistIds: {json.dumps(artist_ids)},')
        lines.append(f'    startDate: "{gsheet_date_to_iso(r["start_date"])}",')
        lines.append(f'    endDate: "{gsheet_date_to_iso(r["end_date"])}",')
        lines.append(f'    description: "{r.get("description", "")}",')
        lines.append(f'    featuredImage: "{featured}",')
        lines.append(f'    folder: "{fid}",')
        lines.append(f'  }},')

    lines.append("];")
    lines.append("")
    lines.append("export default exhibitions;")
    lines.append("")

    out = os.path.join(DATA_DIR, "exhibitions.ts")
    with open(out, "w") as f:
        f.write("\n".join(lines))
    print(f"  → {out} ({len(exh_rows)} exhibitions)")


def download_wix_media(folders: list[str]):
    if not WIX_API_KEY or not WIX_SITE_ID:
        print("  Skipping Wix media (no env vars)")
        return {}

    all_by_folder: dict[str, list[str]] = {}
    MEDIA_API = "https://www.wixapis.com/site-media/v1"
    headers = {"Authorization": WIX_API_KEY, "wix-site-id": WIX_SITE_ID}

    def paginate(path, params, key):
        items = []
        while True:
            qs = "&".join(f"{k}={urllib.request.quote(str(v))}" for k, v in params.items() if v is not None)
            req = urllib.request.Request(f"{MEDIA_API}/{path}?{qs}", headers=headers)
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode())
            items.extend(data.get(key, []))
            cursor = data.get("nextCursor", {}).get("cursors", {}).get("next")
            if not cursor:
                break
            params["paging.cursor"] = cursor
        return items

    def sanitize(name: str) -> str:
        return name.replace("&", "-")

    # Get all folders from Wix
    wix_folders = paginate("folders", {"paging.limit": 100}, "folders")
    folder_map: dict[str, str] = {}
    for f in wix_folders:
        name = sanitize((f.get("displayName") or f["id"][:8]).strip())
        folder_map[f["id"]] = name

    # Reverse map: name → id
    name_to_id = {v: k for k, v in folder_map.items()}

    for folder_name in folders:
        if not folder_name:
            continue
        fid = name_to_id.get(folder_name)
        if not fid:
            print(f"  WARNING: folder '{folder_name}' not found in Wix")
            continue

        files = paginate("files", {"paging.limit": 100, "parentFolderId": fid}, "files")
        names = []
        for ff in files:
            furl = ff.get("url", "")
            fname = sanitize(ff.get("displayName", ""))
            if not furl or not fname:
                continue
            dest = os.path.join(MEDIA_DIR, folder_name, fname)
            if os.path.exists(dest):
                local_size = os.path.getsize(dest)
                remote_size = int(ff.get("sizeInBytes", 0))
                if local_size == remote_size:
                    names.append(fname)
                    continue
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            try:
                req = urllib.request.Request(furl)
                with urllib.request.urlopen(req, timeout=120) as resp:
                    with open(dest, "wb") as f:
                        f.write(resp.read())
                names.append(fname)
            except Exception as e:
                print(f"  FAILED: {folder_name}/{fname}: {e}")
        all_by_folder[folder_name] = names
        print(f"  {folder_name}: {len(names)} images")

    return all_by_folder


def generate_exhibition_images(folder_images: dict[str, list[str]]):
    lines = ["const exhibitionImages: Record<string, string[]> = {"]
    for folder, images in sorted(folder_images.items()):
        escaped = folder.replace('"', '\\"')
        lines.append(f'  "{escaped}": [')
        for img in sorted(images):
            lines.append(f'    "{img.replace(chr(34), chr(92)+chr(34))}",')
        lines.append("  ],")
    lines.append("};")
    lines.append("")
    lines.append("export default exhibitionImages;")
    lines.append("")

    out = os.path.join(DATA_DIR, "exhibitionImages.ts")
    with open(out, "w") as f:
        f.write("\n".join(lines))
    print(f"  → {out}")


def main():
    print("[1/4] Reading Google Sheets...")
    artists_data = fetch_sheet("Artists")
    art_rows = rows_to_dicts(artists_data)
    print(f"  Artists: {len(art_rows)}")

    exhibitions_data = fetch_sheet("Exhibitions")
    exh_rows = rows_to_dicts(exhibitions_data)
    print(f"  Exhibitions: {len(exh_rows)}")

    links_data = fetch_sheet("Exhibitions_Artists")
    link_rows = rows_to_dicts(links_data)
    print(f"  Artist-Exhibition links: {len(link_rows)}")

    print("\n[2/4] Downloading Wix media...")
    exh_folders = [r.get("wix_folder_name", "") for r in exh_rows]
    art_folders = [r.get("wix_folder", "") for r in art_rows if r.get("wix_folder")]
    all_folders = list(set(exh_folders + art_folders))
    all_folders = [f for f in all_folders if f]  # Remove empty
    folder_images = download_wix_media(all_folders)

    # Generate artist images data
    artist_images = {}
    for r in art_rows:
        folder = sanitize(r.get("wix_folder", ""))
        if folder and folder in folder_images:
            artist_images[r["id"]] = folder_images[folder]

    print("\n[3/4] Generating TypeScript data files...")
    generate_artists(art_rows, link_rows)
    generate_exhibitions(exh_rows, link_rows)

    print("\n[4/4] Generating image manifests...")
    if not folder_images:
        folder_images = {}
        if os.path.isdir(MEDIA_DIR):
            for item in sorted(os.listdir(MEDIA_DIR)):
                path = os.path.join(MEDIA_DIR, item)
                if os.path.isdir(path):
                    imgs = sorted([f for f in os.listdir(path) if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".gif"))])
                    folder_images[item] = imgs
    generate_exhibition_images(folder_images)

    # Generate artist images data
    if artist_images:
        lines = ["const artistImages: Record<string, string[]> = {"]
        for aid, imgs in sorted(artist_images.items()):
            lines.append(f'  "{aid}": [')
            for img in sorted(imgs):
                lines.append(f'    "{img.replace(chr(34), chr(92)+chr(34))}",')
            lines.append("  ],")
        lines.append("};")
        lines.append("")
        lines.append("export default artistImages;")
        lines.append("")
        out = os.path.join(DATA_DIR, "artistImages.ts")
        with open(out, "w") as f:
            f.write("\n".join(lines))
        print(f"  → {out} ({len(artist_images)} artists)")

    print("\nDone.")


if __name__ == "__main__":
    main()
