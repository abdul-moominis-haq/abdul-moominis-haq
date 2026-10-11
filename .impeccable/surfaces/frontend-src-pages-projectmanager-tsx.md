---
version: 1
slug: "frontend-src-pages-projectmanager-tsx"
primary_target: "frontend/src/pages/ProjectManager.tsx"
related_targets: ["frontend/src/App.tsx","frontend/src/index.css","frontend/src/lib/neonAuth.ts","frontend/src/lib/projectAdminApi.ts","frontend/src/hooks/usePortfolioProjects.ts","backend/src/routes/projects.js","backend/src/middleware/neonAdmin.js","backend/src/services/cloudinary.js"]
---

## Direction contract

THESIS: Project management is a media-led catalog with a stable, focused editor, not a form hidden behind a generic list. The selected project stays legible while the administrator creates, replaces, saves, or deletes its record.

OWN-WORLD: Inherit the Safelight Contact Sheet exactly: warm paper and enamel surfaces, near-black ink, amber selection, Barlow Condensed headings, Source Sans 3 controls, and fine registration rules. Real uploaded media supplies the only broad image fields; empty media uses an explicit paper-colored placeholder.

STORY: The verified administrator scans existing projects, recognizes each by its image or video and title, selects one, and edits its description, repository, optional hosted link, and media without losing sight of the catalog. Save, upload, error, empty, delete-confirmation, and loading states remain explicit.

FIRST VIEWPORT: A slim brand header links back to the portfolio and exposes the signed-in identity and sign-out. Below it, “Manage projects” and its one-sentence purpose sit beside the New project action. A balanced two-column workspace puts a two-column media catalog on the left and the selected record’s media preview and conventional edit form on the right. At tablet and phone widths, the catalog stacks above the editor and becomes a single-column, touch-friendly selection list.

FORM: “Catalog with focused details,” the third of three grounded structures, selected from the code sketch; seed key 01bab696; source pop-culture-shelf-streaming-title-card-wall. Borrow the selected sketch’s media-led catalog and persistent detail area only: retain standard web controls and the existing Safelight palette, typography, and product facts.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
