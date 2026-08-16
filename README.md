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

The repository uses Eleventy to turn recipe Markdown into a local, printable website.

On Windows, install Node.js and then double-click `browse-recipes.cmd`. It prepares the viewer on first use, opens the recipe site in your default browser, and keeps it entirely on your computer. Keep the terminal window open while browsing, and press `Ctrl+C` there to stop the viewer.

To start it from a terminal instead, run:

```powershell
npm ci
npm run serve
```

Open `http://localhost:8080/` in a browser if it does not open automatically. Press `Ctrl+C` in the terminal to stop the preview server.

See [Generating HTML with Eleventy](docs/generating-html.md) for a complete guide that explains every step.
