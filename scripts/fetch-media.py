#!/usr/bin/env python3
"""Fetch all media files from Wix Media API, save to public/media/, and generate exhibitionImages.ts"""

import json
import os
import sys
import urllib.request

API_KEY = os.environ.get("WIX_API_KEY", "")
SITE_ID = os.environ.get("WIX_SITE_ID", "")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_DIR, "public", "media")
DATA_DIR = os.path.join(PROJECT_DIR, "src", "data")

if not API_KEY or not SITE_ID:
    print("Error: WIX_API_KEY and WIX_SITE_ID environment variables required")
    print("Set them in Vercel dashboard: Project Settings → Environment Variables")
    sys.exit(1)

MEDIA_API = "https://www.wixapis.com/site-media/v1"


def api_call(path, params=None):
    url = f"{MEDIA_API}/{path}"
    if params:
        qs = "&".join(f"{k}={urllib.request.quote(str(v))}" for k, v in params.items() if v is not None)
        url = f"{url}?{qs}"
    req = urllib.request.Request(url, headers={
        "Authorization": API_KEY,
        "wix-site-id": SITE_ID,
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())


def paginate(path, params, key):
    items = []
    while True:
        data = api_call(path, params)
        batch = data.get(key, [])
        items.extend(batch)
        cursor = data.get("nextCursor", {}).get("cursors", {}).get("next")
        if not cursor:
            break
        params["paging.cursor"] = cursor
    return items


def download(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=120) as r:
        with open(dest, "wb") as f:
            f.write(r.read())


def main():
    print("[1/3] Fetching folders...")
    folders = paginate("folders", {"paging.limit": 100}, "folders")
    folder_map = {}
    for f in folders:
        fid = f["id"]
        name = (f.get("displayName") or fid[:8]).strip()
        folder_map[fid] = name
    print(f"  {len(folders)} folders")

    print("[2/3] Fetching file listings...")
    all_by_folder = {}

    root_files = paginate("files", {"paging.limit": 100}, "files")
    root_names = [rf.get("displayName", "") for rf in root_files if rf.get("displayName")]
    all_by_folder[""] = root_names
    print(f"  {len(root_names)} files in root")

    for fid, fname in folder_map.items():
        f_files = paginate("files", {"paging.limit": 100, "parentFolderId": fid}, "files")
        names = [ff.get("displayName", "") for ff in f_files if ff.get("displayName")]
        all_by_folder[fname] = names
        if names:
            print(f"  {len(names)} files in {fname}")

    total = sum(len(v) for v in all_by_folder.values())
    print(f"  {total} total files")

    print("[3/3] Downloading files...")
    count = 0
    root_downloaded = []
    for rf in root_files:
        url = rf.get("url", "")
        name = rf.get("displayName", "")
        if not url or not name:
            continue
        dest = os.path.join(OUTPUT_DIR, name)
        if os.path.exists(dest):
            local_size = os.path.getsize(dest)
            remote_size = int(rf.get("sizeInBytes", 0))
            if local_size == remote_size:
                count += 1
                root_downloaded.append(name)
                continue
        try:
            download(url, dest)
            count += 1
            root_downloaded.append(name)
        except Exception as e:
            print(f"  FAILED (root): {name}: {e}")

    for fid, fname in folder_map.items():
        f_files = paginate("files", {"paging.limit": 100, "parentFolderId": fid}, "files")
        for ff in f_files:
            url = ff.get("url", "")
            name = ff.get("displayName", "")
            if not url or not name:
                continue
            dest = os.path.join(OUTPUT_DIR, fname, name)
            if os.path.exists(dest):
                local_size = os.path.getsize(dest)
                remote_size = int(ff.get("sizeInBytes", 0))
                if local_size == remote_size:
                    count += 1
                    continue
            try:
                download(url, dest)
                count += 1
            except Exception as e:
                print(f"  FAILED: {fname}/{name}: {e}")

    print(f"  Downloaded: {count} files")

    print("[4/4] Generating exhibitionImages.ts...")
    lines = ["const exhibitionImages: Record<string, string[]> = {"]
    # Root
    if root_downloaded:
        lines.append('  "": [')
        for name in sorted(root_downloaded):
            escaped = name.replace('"', '\\"')
            lines.append(f'    "{escaped}",')
        lines.append("  ],")
    for fname, names in sorted(all_by_folder.items()):
        if not fname:
            continue
        escaped_folder = fname.replace('"', '\\"')
        lines.append(f'  "{escaped_folder}": [')
        for name in sorted(names):
            escaped = name.replace('"', '\\"')
            lines.append(f'    "{escaped}",')
        lines.append("  ],")
    lines.append("};")
    lines.append("")
    lines.append("export default exhibitionImages;")
    lines.append("")

    out_path = os.path.join(DATA_DIR, "exhibitionImages.ts")
    with open(out_path, "w") as f:
        f.write("\n".join(lines))
    print(f"  Written to {out_path}")

    print("Done.")


if __name__ == "__main__":
    main()
