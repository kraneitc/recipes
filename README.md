# Recipes

A personal collection of recipes, composed meals, menus, and cooking reference notes.

## Structure

- [`recipes/`](recipes/) contains individual reusable recipes.
- [`inbox/`](inbox/) holds unprocessed notes and drafts.
- [`meals/`](meals/) combines recipes and coordinates their timing.
- [`menus/`](menus/) contains meal plans, rotations, and event menus.
- [`reference/`](reference/) contains shared cooking notes and conversions.
- [`templates/`](templates/) contains starting points for new files.
- [`docs/`](docs/) explains repository workflows in detail.

Create recipes as `recipes/<recipe-slug>/recipe.md`. Use tags in the YAML front matter for categories such as cuisine, course, season, or dietary preference.

## Generate HTML

The repository uses Eleventy to turn recipe Markdown into a local, printable website. After installing Node.js, run:

```powershell
npm ci
npm run serve
```

Open `http://localhost:8080/` in a browser. Press `Ctrl+C` in the terminal to stop the preview server.

See [Generating HTML with Eleventy](docs/generating-html.md) for a complete guide that explains every step.
