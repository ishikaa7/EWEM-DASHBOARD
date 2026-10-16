# EWEM Portfolio Dashboard — Ishika Bhute

A static, responsive coursework portfolio for **Environmental Waste and E-waste Management (EWEM)** by **Ishika Bhute (24102C0025, TE CMPN C)**.
It presents ISA and ESE activities, projects/research, and a searchable file browser that links to the
actual submission files stored in the `Assignments/` directory.

Built with plain **HTML, CSS, and vanilla JavaScript** — no backend, build step, framework, API keys,
authentication, or third-party runtime dependencies. It is designed to be published with **GitHub Pages**.

---

## Features

- Compact hero with an abstract, locally stored SVG visual (no external images).
- Data-grounded statistics derived from the manifest (listed activities vs. files verified on disk).
- ISA (5) and ESE (8) activity cards with category badges, file links, and clear **not-yet-linked** states.
- Projects & research section with category filters; one canonical record can belong to several categories,
  and each row expands to reveal its linked files (open in-tab for PDFs/images, download for Office files).
- Searchable **file browser**: filter by category and file type, with open/download actions and an empty state.
- Light/dark theme with a sensible default (stored in `localStorage`, defaults to the OS preference).
- Responsive mobile navigation, smooth scrolling, active-section highlighting.
- Accessible markup: skip link, semantic landmarks, visible focus states, keyboard support, reduced-motion support.

---

## Folder structure

```text
EWEM/                         (repository root = published site root)
├── index.html                # tiny redirect → ewem-dashboard/
├── .nojekyll                 # tells GitHub Pages not to run Jekyll
├── Assignments/              # your original submissions (left untouched)
│   ├── Assignment 1_ E waste Tracker/
│   ├── Assignment 2/
│   ├── Assignment 3/
│   ├── Campaign For E Waste in Campus_Class Activity/
│   ├── Carbon Footprint/
│   ├── Case Studies E waste/
│   ├── E waste India Vs World Data/
│   ├── EwasteRecovery Process_Modification for Design Patent/
│   ├── IEEE Paper Submission/
│   ├── Indian Companies Following E waste Rules_Comparative Study/
│   ├── LEED Certification of Green Buildings in India/
│   ├── Novel Idea_E waste_Pitch Deck/
│   ├── State tracker submission/
│   └── Toxic Chemicals_ Any5/
└── ewem-dashboard/
    ├── index.html
    ├── style.css
    ├── script.js
    ├── README.md
    └── assets/
        ├── data/assignments.json      # the manifest (all content + file metadata)
        └── images/
            ├── contour.svg            # hero visual
            └── favicon.svg
```

The dashboard lives in `ewem-dashboard/` but references assignment files as `../Assignments/…`.
Because GitHub Pages serves the **whole repository**, those relative paths resolve correctly whether
the site is published at a project URL such as `https://<user>.github.io/<repo>/` or locally.

> **Do not move `Assignments/` out of the repository.** The published site and the files it links to must
> ship together. Original files are never modified by this project.

---

## Running locally

Browsers block `fetch()` of the JSON manifest when a page is opened directly from disk (`file://`).
Run a small static server from the **repository root** (so both `ewem-dashboard/` and `Assignments/` are served):

```powershell
# Python 3 (from the repository root)
python -m http.server 8000
# then open http://localhost:8000/ewem-dashboard/
```

```powershell
# or Node.js
npx serve .
# then open the printed URL for /ewem-dashboard/
```

If the manifest cannot be loaded, the dashboard shows a friendly error in each section instead of failing silently.

---

## How metadata and links are managed

Everything the site displays comes from **`ewem-dashboard/assets/data/assignments.json`**:

- `assignmentsBase` — relative prefix to the assignment files (`../Assignments/`). Change this only if you
  relocate the `Assignments/` folder.
- `fileTypes` — human-readable labels, grouping, and whether a type opens in-browser (`viewable`).
- `categories` — the labels shown on badges and filters.
- `files[]` — one entry per submission file:
  - `path` — path relative to `assignmentsBase` (no leading slash),
  - `ext`, `sizeBytes` — used for the type label and size display,
  - `category` / `activity` — grouping.
- `isaActivities[]`, `eseActivities[]` — titles, descriptions, icons, and the `files[]` they link to.
  An empty `files` array renders the **"Not yet linked"** state.
- `projects[]` — canonical project records with `categories[]` (may belong to several filters) and `files[]`.

Paths containing spaces or special characters are URL-encoded at runtime (`encodePath()` in `script.js`),
so links remain valid without hard-coding `%20`.

### Adding or linking a new submission

1. Drop the file inside the appropriate folder under `Assignments/` (do not rename existing files).
2. Add a `files[]` entry with its `path`, `ext`, and `sizeBytes` (the file size in bytes).
3. Reference the new file id from the relevant activity and/or project.
4. Reload the page — links are built from the manifest, so no HTML edits are needed.

---

## Deploying to GitHub Pages

1. Commit the repository **including** `Assignments/`, `ewem-dashboard/`, root `index.html`, and `.nojekyll`.
2. Push to GitHub.
3. In the repository: **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
6. Wait for the deployment to finish. The site appears at:

   `https://<username>.github.io/<repository-name>/`

   The root `index.html` redirects to `ewem-dashboard/`, which is where the dashboard actually lives.

> Publishing from the repository **root** is required so the `../Assignments/…` links resolve.
> Publishing only the `ewem-dashboard/` folder would break them, because `Assignments/` sits above it.

---

## Verifying links after deployment

1. Open the deployed `/ewem-dashboard/` URL (not just the repo root).
2. Use the **Resources** section to open one PDF and download one Office file.
3. Confirm the URL in the new tab contains `/Assignments/…` immediately after the repository name.
4. Spot-check a filename with spaces (for example the tracker workbook) to confirm encoding works.

You can also verify locally before pushing by running the static server and clicking through every file.

---

## Intentionally missing / not-yet-linked items

This activity is **listed in the course brief** but no matching submission file was required or found in
`Assignments/`, so it renders with a **"Not yet linked"** state:

- **ISA — Assignment Zero: Check AAP** (Introductory review activity)

All other 12 ISA and ESE activities have their verified submission files linked directly to the `Assignments/` directory.

---

## Browser support & accessibility

Tested for modern evergreen browsers. Includes keyboard navigation, a skip link, `aria-live` regions for
dynamic content, `prefers-color-scheme` and `prefers-reduced-motion` support, and a print stylesheet.
Icons are inline SVG, so there is no icon-font or CDN dependency.
