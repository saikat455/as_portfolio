# Developer Portfolio

A responsive portfolio built with plain HTML, CSS and JavaScript. No build step.

## Run it
Double-click `index.html`, or serve the folder (e.g. VS Code "Live Server").

## Files
- `index.html` – all content
- `style.css` – styles and theme colors
- `script.js` – interactions (typewriter, filters, form, theme)

## How to edit
1. **Content** – search `index.html` for `EDIT:` comments. Each marks text to replace (name, links, about, skills, projects, timeline, contact).
2. **Typewriter roles** – edit the `ROLES` array at the top of `script.js`.
3. **Colors** – change the variables at the top of `style.css` (`--accent-1`, `--accent-2`, `--bg`, …). Light-mode colors are in the `[data-theme="light"]` block.
4. **Skill bars** – change `data-level="85"` (0–100) and the visible percentage text.
5. **Projects filter** – each project card has `data-category="web|mobile|ai"`. To add a category, add a button with a matching `data-filter`.
6. **Images** – create an `images/` folder, drop your photos in, and update the `src` attributes.
7. **Resume** – put `resume.pdf` next to `index.html` (or change the link's `href`).
8. **Contact form** – currently demo-only. For real emails, use a service like Formspree: set `action="https://formspree.io/f/yourid" method="POST"` on the form and remove the `e.preventDefault()` logic in `initContactForm`.

## Deploy
Upload the folder to GitHub Pages, Netlify or Vercel — it's just static files.
