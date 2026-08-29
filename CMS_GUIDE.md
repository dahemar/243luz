# 243 Luz — Website CMS Guide

Everything on the website is managed from a single Google Sheet. Changes go live on the next deploy.

---

## The Sheet

**Link:** https://docs.google.com/spreadsheets/d/1I2ab8Lq6vy03UFU7aQ7tCnyddoh8Y06YD_drcH48CzI

There are four tabs:

### 1. Exhibitions tab

| Column | What to put |
|--------|-------------|
| id | Short slug, no spaces. e.g. `sunset-beach` |
| title | Full exhibition name |
| start_date | Any format you want. e.g. `15 September 2025`, `Jun–Jul 2024`, `Spring 2025` |
| end_date | Same as above |
| description | Short description or artist name. Appears under the title on the exhibition page. Can be empty. |
| wix_folder_name | Exact name of the folder in **Wix Media Manager** that contains the exhibition images. The site pulls all images from this folder automatically. |
| order | Number. Lower = appears closer to the top (ordered newest first by default). |

**To add a new exhibition:**
1. Create a new folder in Wix Media Manager and upload the images there
2. Add a new row in this tab with the folder name in `wix_folder_name`

### 2. Artists tab

| Column | What to put |
|--------|-------------|
| id | Short slug, no spaces. e.g. `salomon-garcon` |
| name | Full artist name |
| biography | Full text with line breaks. **Links are auto-detected and become clickable.** |
| wix_folder | (Optional) Wix folder name with additional images for the artist page gallery. |

**To insert images inside the biography:**
```
[img]https://static.wixstatic.com/media/abc123.jpg[/img]
```
The image will appear inline at that position on the artist's page.

**If an artist has no exhibitions and no biography**, their name shows as plain text on the Artists page (no detail page is generated).

### 3. Exhibitions_Artists tab

Links artists to exhibitions. Each row is one link.

| Column | What to put |
|--------|-------------|
| exhibition_id | The `id` from the Exhibitions tab |
| artist_id | The `id` from the Artists tab |

Example: `sunset-beach` → `salomon-garcon`

### 4. Editions tab

Editions are limited-edition works available for purchase. Each row is one edition.

| Column | What to put |
|--------|-------------|
| id | Short slug, no spaces. e.g. `garcon-jog-mode` |
| artist_id | The `id` from the Artists tab |
| title | Title of the edition |
| year | Year it was made |
| medium | Print/medium type. e.g. `Archival pigment print` |
| dimensions | e.g. `29.7 × 42 cm` |
| edition_size | e.g. `Edition of 25 + 2 AP` |
| price | e.g. `£450` or `Price on request` |
| currency | e.g. `GBP` |
| availability | One of `available`, `sold`, or `enquire` |
| description | Short description. Can be empty. |
| image | Path or full URL to the edition image. Can be a Wix static URL. |
| buy_url | The external checkout link (e.g. a Stripe Payment Link). Only used when availability is `available`. Leave empty to fall back to an enquiry email. |

**How buying works (version A):** editions marked `available` show a **Buy** button that opens `buy_url` in a new tab. Editions marked `sold` show a **Sold** label, and `enquire` shows an **Enquire** button that opens an email to `info@243luz.com`. If `buy_url` is empty, the Buy button falls back to an enquiry email.

---

## How images work

- For each exhibition: put images in a folder inside **Wix Media Manager**. Write the folder name in `wix_folder_name`.
- For each artist: put additional images in a Wix folder. Write the folder name in `wix_folder`.
- At build time, the site downloads all images from Wix automatically.

You don't need to upload images individually to the site — just manage them in Wix.

---

## How to see changes live

The website rebuilds automatically when changes are pushed to GitHub. The full pipeline is:

1. Edit the Google Sheet
2. Trigger a build (push to GitHub, or redeploy on Vercel)
3. The site reads the Sheet → downloads images from Wix → generates a fresh static site

---

## Troubleshooting

**My dates show as numbers like "46037":**  
Format the date column as **Plain text** in Google Sheets (Format → Number → Plain text), then type the date however you want.

**Images don't appear:**  
Check the folder name in `wix_folder_name` matches exactly the folder name in Wix Media Manager (capitalisation, spaces, punctuation must match).

**A link in a biography isn't clickable:**  
Make sure the URL starts with `http://` or `https://`. Links are auto-detected.

---

## How to rebuild the site locally

```
npm run sync-sheets    # Pull data from Google Sheets + download Wix images
npm run dev            # Start local server at http://localhost:4321
npm run build          # Full build → output in dist/
```
